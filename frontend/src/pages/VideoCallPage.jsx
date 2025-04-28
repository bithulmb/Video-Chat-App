import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import api from '@/axios/api';
import useAuth from '@/components/hooks/useAuth';
import { ZEGO_APP_ID } from '@/utils/constants/constants';

const VideoCallPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const appID = ZEGO_APP_ID; 
  const userID = String(user.id); 
  const userName = user.username;

  useEffect(() => {
    const joinVideoCall = async () => {
      try {
        const response = await api.post('/api/video/generate-zego-token/', { room_id: roomId });
        const { token } = response.data;
        
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
             appID,
              token,
              roomId,
              userID ,
              userName
              
            );
          console.log(kitToken,"kittoken")
       
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
          container: document.getElementById('video-call-container'),
          sharedLinks: [],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
          },
         
          showPreJoinView: true,
          userID,
          userName,
          onLeaveRoom: () => {
            navigate(`/rooms/${roomId}`);
          },
        });

      } catch (error) {
        console.error('Failed to join video call:', error);
        navigate(`/rooms/${roomId}`);
      }
    };

    joinVideoCall();
  }, [roomId, navigate, user.username]);

  return (
    <div id="video-call-container" className="w-full h-screen bg-background"></div>
  );
};

export default VideoCallPage;
