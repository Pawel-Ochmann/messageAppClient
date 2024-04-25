import { useState, useContext } from "react";
import { Socket, io } from 'socket.io-client';
import { getAddress } from "../utils/serverAddress";
import { UserContext } from '../Context';


export const useSocket = ()=> {
    const [socket] = useState<Socket>(
      io(getAddress(''), {
        reconnectionDelayMax: 10000,
        timeout: 5000,
        reconnectionAttempts: 3,
        autoConnect: false,
      })
    );
    const [socketConnected, setSocketConnected] = useState(false);
      const { user, setUser } = useContext(UserContext);

        const connectToSocket = async () => {
          try {
            if (socket && !socketConnected) {
              console.log('connecting to socket');
              socket.connect();
            }
          } catch (error) {
            console.error('Error connecting to socket:', error);
          }
        };

         const handleIncomingMessage = (conversation) => {
           updateConversation(setUser, conversation, chatOpen, setChatOpen);
           if (
             conversation.messages[conversation.messages.length - 1].author !==
             user?.name
           ) {
             const newMessageAudio = new Audio('/audio/newMessage.wav');
             const volume = localStorage.getItem('volume');
             if (volume) newMessageAudio.volume = parseInt(volume) / 100;
             newMessageAudio.play();
           }
         };

         const handleUpdatedUserDocument = (updatedUser) => {
           const newMessageAudio = new Audio('/audio/newConversation.wav');
           const volume = localStorage.getItem('volume');
           if (volume) newMessageAudio.volume = parseInt(volume) / 100;
           newMessageAudio.play();
           setUser(updatedUser);
           newGroup && setNewGroup(false);
         };

         const handleSocketConnect = ()=>{
              user && socket.emit('join', user.name);
              setSocketConnected(true);            
         }
}