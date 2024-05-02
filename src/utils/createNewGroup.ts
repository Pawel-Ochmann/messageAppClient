import { ConversationType } from "../types";
import { Socket } from "socket.io-client";

interface Props{socket:Socket, newConversation:ConversationType, groupImage:File|null}

export const createNewGroup = async ({socket, newConversation, groupImage}:Props) =>{

    await socket.emit(
      'createNewConversation',
      newConversation,
      async (confirmation: boolean) => {
        if (confirmation && groupImage) {
          const reader = new FileReader();
          reader.onload = () => {
            socket.emit(
              'setGroupImage',
              newConversation.key,
              groupImage,
              (confirmation: boolean) => {
                if (!confirmation) {
                  console.error('Error: Group image could not be set');
                }
              }
            );
          };

          reader.readAsDataURL(groupImage);
        } else if (confirmation) {
          console.log('Group created');
        } else {
          console.error('Error: New chat creation confirmation failed');
        }
      }
    );
    }