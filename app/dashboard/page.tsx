import { BotIcon } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="relative max-w-2xl w-full">
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-teal-100 to-teal-50 rounded-3xl"></div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem] rounded-3xl"></div>

        <div className="relative space-y-6 p-8 text-center">
          <div className="bg-white/60 backdrop-blur-sm shadow-sm ring-1 ring-teal-200/50 rounded-2xl p-6 space-y-4">
            <div className="bg-gradient-to-b from-teal-50 to-white rounded-xl p-4 inline-flex">
              <BotIcon className="w-12 h-12 text-teal-600" />
            </div>
            <h2 className="text-2xl font-semibold bg-gradient-to-br from-teal-900 to-teal-600 bg-clip-text text-transparent">
              Welcome, Just Ask Me Stuff!
            </h2>
            <p className="text-teal-600 max-w-md mx-auto">
              Start a new conversation or select an existing chat from the
              sidebar. I'm here to help you with anything you need.
            </p>
            <div className="pt-2 flex justify-center gap-4 text-sm text-teal-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 square-full bg-red-500"></div>
                Real-time chat
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 square-full bg-green-500"></div>
                Smart actions
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 square-full bg-blue-500"></div>
                Useful tools
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}