import { 
    SET_ALL_POSTS,
    SET_ALL_ACCOUNT_POST,
    SET_CURRENT_USER,
    SET_ALL_CHATS,
    CLEAN_ALL_REDUCER_STATES,
    SET_SOCKET,
} from '../actions/index';


const intialState = {
    User: null,
    Posts: null,
    AccountPosts: null,
    Chats: null,
    Socket: null,
}

// eslint-disable-next-line
export default (state = intialState, action) => {
    switch(action.type) {
        case SET_SOCKET:
            return {
                ...state,
                Socket: action.socket
            }
        case SET_CURRENT_USER:
            return {
                ...state,
                User: action.user
            }
        case SET_ALL_POSTS:
            return {
                ...state,
                Posts: action.posts
            }
        case SET_ALL_ACCOUNT_POST:
            return {
                ...state,
                AccountPosts: action.posts
            }
        case SET_ALL_CHATS:
            return {
                ...state,
                Chats: action.chats
            }
        case CLEAN_ALL_REDUCER_STATES:
            return {
                ...state,
                User: action.clean,
                Posts: action.clean,
                Chats: action.clean
            }
        default:
            return state
    }
}