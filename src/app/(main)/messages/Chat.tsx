"use client"

import { Loader2 } from "lucide-react";
import useInitializeChatClient from "./useInitializeChatClients"
import {Chat as StreamChat } from "stream-chat-react";
import ChatSidebar from "./chatSidebar";
import ChatChannel from "./ChatChannel";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function Chat() {
    const chatClient = useInitializeChatClient();

    const {resolvedTheme} = useTheme();

    const [sidebarOpen, setSiderbarOpen] = useState(false);

    if (!chatClient) {
        return <Loader2 className="mx-auto my-5 animate-spin" />
    }

    return <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
        <div className="absolute bottom-0 top-0 flex w-full">
            <StreamChat client={chatClient}
            theme={
                resolvedTheme === "dark"
                ? "str-chat__theme-dark"
                : "str-chat__theme-light"
            }>
                <ChatSidebar
                open={sidebarOpen}
                onClose={() => setSiderbarOpen(false)}
                />
                <ChatChannel 
                open={!sidebarOpen}
                openSidebar={() => setSiderbarOpen(true)}
                />
            </StreamChat>
        </div>
    </main>
} 