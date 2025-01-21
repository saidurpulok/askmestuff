import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  trimMessages,
} from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";
import {
  END,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { MemorySaver } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import wxflows from "@wxflows/sdk/langchain";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

import SYSTEM_MESSAGE from "@/constants/systemMessage";
import { Id } from "@/convex/_generated/dataModel";

// Trim the messages to manage conversation history
const initialTrimmer = trimMessages({
  maxTokens: 10,
  strategy: "last",
  tokenCounter: (msgs) => msgs.length,
  includeSystem: true,
  allowPartial: false,
  startOn: "human",
});

// Connect to wxflows
const toolClient = new wxflows({
  endpoint: process.env.WXFLOWS_ENDPOINT || "",
  apikey: process.env.WXFLOWS_APIKEY,
});

// Retrieve the tools
const tools = await toolClient.lcTools;
const toolNode = new ToolNode(tools);

// Connect to the LLM provider with better tool instructions
function initialiseModel() {
  const model = new ChatGroq({
    modelName: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.7,
    maxTokens: 4096,
    streaming: false, // <--- single-response mode
  }).bindTools(tools);

  return model;
}

/** 
 * If the last AI message calls a tool, route to "tools". 
 * Otherwise, stop.
 */
function shouldContinue(state: typeof MessagesAnnotation.State) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as { tool_calls?: any[] };
  if ('tool_calls' in lastMessage && lastMessage.tool_calls?.length) {
    return "tools";
  }
  return END;
}

// Optional: trim messages if you want to limit conversation length
const trimmer = trimMessages({
  maxTokens: 500,
  strategy: "last",
  tokenCounter: (msgs) => msgs.length,
  includeSystem: true,
  startOn: "human",
});

/** 
 * Node function: calls the model once using prompt template & system message
 */
async function callModel(state: typeof MessagesAnnotation.State) {
  const systemContent = SYSTEM_MESSAGE || "You are a helpful AI.";

  const promptTemplate = ChatPromptTemplate.fromMessages([
    new SystemMessage(systemContent),
    new MessagesPlaceholder("messages"),
  ]);

  // Trim conversation if needed
  const trimmedMessages = await trimmer.invoke(state.messages);
  const prompt = await promptTemplate.invoke({ messages: trimmedMessages });

  // Single call to ChatGroq
  const model = initialiseModel();
  const response = await model.invoke(prompt);

  // Return { messages: [ AIMessage(...) ] }
  return { messages: [response] };
}

/** 
 * Create the workflow (StateGraph)
 */
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent");

/** 
 * Compile into a runnable app
 */
const app = workflow.compile({
  checkpointer: new MemorySaver(),
});

/**
 * Finally, the submitQuestion function. 
 * It invokes the app once, returning the final state which includes the new AIMessage.
 */
export async function submitQuestion(
  messages: BaseMessage[],
  chatId: Id<"chats">
) {
  const finalState = await app.invoke(
    { messages },
    {
      configurable: { thread_id: chatId }, 
      runId: chatId
    }
  );

  // finalState typically looks like { messages: [ ...all messages... ] }
  return finalState;
}