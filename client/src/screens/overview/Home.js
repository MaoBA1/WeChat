import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, Animated } from 'react-native';
import Colors from '../../utilities/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeHeader from '../../components/HomeHader';
import { CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setAllPosts, setAllAccountPosts, setAllChats, setUser } from '../../store/actions';
import Post from '../../components/Post';
import PostCommentsModal from './Modals/PostCommentsModal';
import UploadPostModal from './Modals/UploadPostModal';
import SearchModal from './Modals/SearchModal';

function Home({ navigation }) {
    const dispatch = useDispatch();
    const socket = useSelector(state => state.Reducer.Socket);
    const userSelector = useSelector(state => state.Reducer.User);
    const userChats = useSelector(state => state.Reducer.Chats);
    const allPostSelector = useSelector(state => state.Reducer.Posts);
    const friends = userSelector?.friends;

    const [ isLoading, setIsLoading ] = useState(false);
    const [ postForCommentModal, setPostForCommentModal ] = useState(null);
    const [ commentModalVisible, setCommentModalVisible ] = useState(false);
    const [ uploadPostModatVisible, setUploadPostModalVisible ] = useState(false);
    const [ searchModalVisible, setSearchModalVisible ] = useState(false);
    
    const loguot = async() => {
        try {
            await AsyncStorage.removeItem('Token')
            .then(() => {
                setIsLoading(true);
                setTimeout(() => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Entry' }], 
                        })
                    );
                    socket?.disconnect();
                    setIsLoading(false);
                },2000)
            })
        } catch(error) {
            console.log(error.message);
        }
    }
    const scrollY = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if(!userChats) {
            socket?.emit("get_all_chats", { accountId: userSelector?._id });
        } 

        const handelUserChanges = (data) => {
            console.log(data);
            const account_updated = data.account ? data.account : data.account_updated 
            try {
                dispatch(setUser(account_updated));
            } catch(error) {
                console.log(error.message);
            }
        }

        const handelReciveMessage = async(data) => {
            try {
                await dispatch(setAllChats(data.accountChats));
            } catch(error) {
              console.log(error.message);   
            }    
        }


        socket?.emit('recive_all_friends_post', {friends: friends?.map(f => f._id)});
        socket?.emit('recive_all_account_posts', {accountId: userSelector?._id});
        

        socket?.on("recive_all_post", (response) => setAllPosts(response, dispatch));
        socket?.on("recive_all_account_posts", (response) => setAllAccountPosts(response, dispatch));
        socket?.on("get_updated_post", (response) => setPostForCommentModal(response.updated_post));
        socket?.on("account_changes", handelUserChanges);
        socket?.on("auth_user", handelUserChanges);
        socket?.on("account_updated", handelUserChanges);
        socket?.on("get_all_chats", handelReciveMessage);
        return () => {
            socket?.off("recive_all_post", setAllPosts);
            socket?.off("get_updated_post", setPostForCommentModal);
            socket?.off("recive_all_account_posts", setAllAccountPosts);
            socket?.off("account_changes", handelUserChanges);
            socket?.on("auth_user", handelUserChanges);
            socket?.off("account_updated", handelUserChanges);
            socket?.off("get_all_chats", handelReciveMessage);
        }
    }, []);
    
    
    if(isLoading) {
        return <View style={{ 
            justifyContent:"center",
            backgroundColor: Colors.whiteBackground,
            width:"100%",
            height:"100%",
            alignItems:"center",
        }}>
            <ActivityIndicator
                color={Colors.purple1}
                size={"large"}
            />
        </View>
    }

    return (  
        <View style={{
            flex:1,
            backgroundColor: Colors.whiteBackground,
        }}>
            <PostCommentsModal
                visible={commentModalVisible}
                setVisible={setCommentModalVisible}
                cleanPost={() => setPostForCommentModal(null)}
                post={postForCommentModal}
            />

            <UploadPostModal
                visible={uploadPostModatVisible}
                setIsVisible={setUploadPostModalVisible}
            />
            
            <SearchModal
                visible={searchModalVisible}
                setIsVisible={setSearchModalVisible}
                navigate={navigation.navigate}
            />

            <Animated.FlatList
                style={{ flex:1 }}
                contentContainerStyle={{ paddingTop:120 }}
                data={allPostSelector?.filter(p => friends?.filter(f => f.status === "friend")?.map(f => f._id).includes(p?.postAuthor?._id.toString()))}
                keyExtractor={item => item._id}
                renderItem={({item, index}) => 
                    <Post
                        post={item}
                        setCommentModalVisible={setCommentModalVisible}
                        setPostForCommentModal={() => setPostForCommentModal(item)}
                        navigate={() => navigation.navigate("OtherProfile", { accountId: item?.postAuthor._id })}
                    />
                }
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
            />
            <HomeHeader 
                logout={loguot} 
                scrollY={scrollY} 
                setUploadPostModalVisible={setUploadPostModalVisible}
                setSearchModalVisible={setSearchModalVisible}
            />
        </View>
    );
}




export default Home;