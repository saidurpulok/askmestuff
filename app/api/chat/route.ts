// FILE: app/api/chat/route.ts
import { submitQuestion } from "@/lib/langgraph"; // your updated no-stream version
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  AIMessage,
  HumanMessage,
} from "@langchain/core/messages";
import { getConvexClient } from "@/lib/convex";
import {
  ChatRequestBody,
} from "@/lib/types";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages, newMessage, chatId } =
      (await req.json()) as ChatRequestBody;

    // Save the user's new message to your DB (Convex)
    const convex = getConvexClient();
    await convex.mutation(api.messages.send, {
      chatId,
      content: newMessage,
    });

    // Convert messages to LangChain format
    const langChainMessages = [
      ...messages.map((msg) =>
        msg.role === "user"
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      ),
      new HumanMessage(newMessage),
    ];

    // Call your no-stream version of submitQuestion
    const result: any = await submitQuestion(langChainMessages, chatId);
    // console.log("***DEBUG: Result:", result);
    // result should have { messages: [AIMessage(...)] } from the last node
    const finalMessages = result?.messages || [];
    console.log("***DEBUG: Final messages Plural:", finalMessages);
    const finalMessage = finalMessages[finalMessages.length - 1];
    console.log("***DEBUG: Final message:", finalMessage);
    const assistantText = finalMessage?.content ?? "lol what!";

    // Optionally store the assistant message in your DB
    await convex.mutation(api.messages.store, {
      chatId,
      content: assistantText,
      role: "assistant",
    });

    // Return the entire text in a normal JSON response
    return NextResponse.json({ content: assistantText });
  } catch (error) {
    console.error("Error in chat API (no streaming):", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
