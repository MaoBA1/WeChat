import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../utilities/Colors';
import PostCommentsModal from './Modals/PostCommentsModal';
import ProfileHeader from '../../components/ProfileHeader';
import Post from '../../components/Post';
import UploadPostModal from './Modals/UploadPostModal';

function Profile({ navigation }) {
    const socket = useSelector(state => state.Reducer.Socket);
    const userSelector = useSelector(state => state.Reducer.User);
    const allPostSelector = useSelector(state => state.Reducer.Posts);
    const friends = userSelector?.friends;
    

    const [ postForCommentModal, setPostForCommentModal ] = useState(null);
    const [ commentModalVisible, setCommentModalVisible ] = useState(false);
    const [ allFriendsAcconts, setAllFriendsAccounts ] = useState([]);
    const [ intialUserData, setIntialUserData ] = useState(userSelector);
    const [ uploadPostModatVisible, setUploadPostModalVisible ] = useState(false);
    
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if(allFriendsAcconts.length === 0 || userSelector !== intialUserData) {
            socket?.emit("get_all_user_friend", { friends });
            setIntialUserData(userSelector);
        }
        socket?.on("get_all_user_friend", ({ AllFriendsAccounts }) => {setAllFriendsAccounts(AllFriendsAccounts?.filter(f => f.status === "friend"))});
        socket?.on("get_updated_post", (response) => setPostForCommentModal(response.updated_post));
        return () => {
            socket?.off("get_all_user_friend", setAllFriendsAccounts);
            socket?.off("get_updated_post", setPostForCommentModal);
        }
    },[])
    
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
            <Animated.FlatList
                style={{ flex:1 }}
                contentContainerStyle={{ paddingTop:150 }}
                data={allPostSelector.filter(p => p?.postAuthor._id === userSelector._id)}
                keyExtractor={item => item._id}
                renderItem={({item, index}) => 
                    <Post
                        post={item}
                        setCommentModalVisible={setCommentModalVisible}
                        setPostForCommentModal={() => setPostForCommentModal(item)}
                    />
                }
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
            />
            <ProfileHeader scrollY={scrollY} friendsCount={allFriendsAcconts?.length} setUploadPostModalVisible={setUploadPostModalVisible}/>
        </View>
    );
}

export default Profile;