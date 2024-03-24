import {User, ConversationType} from '../types/index';

const getConversationName = (user:User, conversation:ConversationType):string=> {
    if (conversation.name.length === 1) return conversation.name[0];
    else {
        const namesFiltered = conversation.name.find((name)=>{
            return name !== user.name;
        })
       return namesFiltered ? namesFiltered : '';
    }
}

export default getConversationName;