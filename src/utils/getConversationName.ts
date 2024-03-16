import {User, ConversationType} from '../types/index';

const getConversationName = (user:User, conversation:ConversationType)=> {
    console.log('user: ', user, 'conversation.name: ', conversation.name)
    if (conversation.name.length === 1) return conversation.name[0];
    else {
        const namesFiltered = conversation.name.find((name)=>{
            return name !== user.name;
        })
        return namesFiltered;
    }
}

export default getConversationName;