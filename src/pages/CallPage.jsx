// src/pages/CallPage.jsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  StreamVideo,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

import PageLoader from "../components/PageLoader";
import { getStreamToken, setClient, setCall } from "../slice/chatSlice";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const dispatch = useDispatch();

  const { user, isLoading: userLoading } = useSelector((state) => state.auth);
  const { token, client, call, loading } = useSelector((state) => state.chat);

  // Fetch Stream token when user is ready
  useEffect(() => {
    if (user) dispatch(getStreamToken());
  }, [user, dispatch]);

  useEffect(() => {
    const initCall = async () => {
      if (!token || !user || !callId) return;

      try {
        // ✅ Rename to avoid shadowing
        const streamUser = {
          id: user._id,
          name: user.fullName,
          image: user.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: streamUser,
          token,
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        dispatch(setClient(videoClient));
        dispatch(setCall(callInstance));
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      }
    };

    initCall();
  }, [token, user, callId, dispatch]);

  if (userLoading || loading) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) navigate("/");

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
