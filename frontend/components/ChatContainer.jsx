import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,  
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);


  // Load messages
  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id,getMessages,subscribeToMessages,unsubscribeFromMessages]);

  // Auto scroll
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader />

     <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">

        {messages.map((message) => {
          const isMe =
            String(message.senderId) === String(authUser?._id);

          return (
            <div
              key={message._id}
              className={`chat ${isMe ? "chat-end" : "chat-start"}`}
            >
              {/* Avatar */}
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isMe
                        ? authUser?.profilePic || "/avatar.png"
                        : selectedUser?.profilePic || "/avatar.png"
                    }
                    alt="profile"
                  />
                </div>
              </div>

              {/* Time */}
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              {/* Message */}
              <div className="chat-bubble flex flex-col gap-2 max-w-[250px]">
                {message.image && (
                  <img
                    src={message.image}
                    alt="attachment"
                    className="rounded-md object-cover"
                  />
                )}

                {message.text && (
                  <p className="break-words">
                    {message.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Scroll anchor */}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;