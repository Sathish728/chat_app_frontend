import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getStreamToken } from "../slice/chatSlice";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const dispatch = useDispatch();

  // Redux states
  const { user } = useSelector((state) => state.auth);
  const { token, isLoading, error } = useSelector((state) => state.chat);

  // Local component states
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch token once user is available
  useEffect(() => {
    if (user?._id) {
      dispatch(getStreamToken());
    }
  }, [dispatch, user]);

  // Initialize Stream client when token and user are ready
  useEffect(() => {
    const initChat = async () => {
      if (!token || !user?._id) return;

      try {
        console.log("🔹 Initializing Stream Chat Client...");
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: user._id,
            name: user.fullName,
            image: user.profilePic,
          },
          token
        );

        // Unique channel id for both users
        const channelId = [user._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [user._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (err) {
        console.error("❌ Error initializing chat:", err);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [token, user, targetUserId]);

  // Handle sending a video call link message
  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Video call link sent successfully!");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, [chatClient]);

  // Loading and error states
  if (isLoading || loading) return <ChatLoader />;
  if (error) {
    toast.error(error);
    return <div className="p-6 text-center">Error: {error}</div>;
  }
  if (!chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
