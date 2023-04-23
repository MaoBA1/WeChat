import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, Animated, Text } from 'react-native';
import Colors from '../../utilities/Colors';
import OtherProfileHeader from '../../components/OtherProfileHeader';
import { useSelector } from 'react-redux';
import Post from '../../components/Post';
import PostCommentsModal from './Modals/PostCommentsModal';



function OtherAccountProfile({ navigation, route }) {
    const scrollY = useRef(new Animated.Value(0)).current;
    const thisAccountId = route.params.accountId;
    const socket = useSelector(state => state.Reducer.Socket);
    const allPostSelector = useSelector(state => state.Reducer.Posts);

    const [ thisAccount, setThisAccount ] = useState(null);
    const [ postForCommentModal, setPostForCommentModal ] = useState(null);
    const [ commentModalVisible, setCommentModalVisible ] = useState(false);
    
    

    useEffect(() => {
        if(!thisAccount) {
            socket?.emit("get_account_by_id", { accountId: thisAccountId });
        }
        socket?.on("get_account_by_id", (response) => setThisAccount(response.account));
        socket?.on("get_updated_post", (response) => setPostForCommentModal(response.updated_post));
        return () => {
            socket?.off("get_account_by_id", setThisAccount);
            socket?.off("get_updated_post", setPostForCommentModal);
        }
    },[thisAccount])

    if(!thisAccount) {
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
            alignItems:"center",
            justifyContent:"center"
        }}>
            <PostCommentsModal
                visible={commentModalVisible}
                setVisible={setCommentModalVisible}
                cleanPost={() => setPostForCommentModal(null)}
                post={postForCommentModal}
            />
            {
                allPostSelector?.filter(p => p?.postAuthor._id === thisAccountId)?.length > 0 ?
                (
                    <Animated.FlatList
                        style={{ flex:1 }}
                        contentContainerStyle={{ paddingTop:160 }}
                        data={allPostSelector.filter(p => p?.postAuthor._id === thisAccountId)}
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
                )
                :
                (
                    <View style={{
                        flex:1,
                        width:"100%",
                        alignItems:"center",
                        justifyContent:"center"
                    }}>
                        <Text style={{
                            fontFamily:"regular",
                            color:Colors.blue1,
                            fontSize:18
                        }}>
                            This account didn't upload any post yet
                        </Text>
                    </View>
                )
            }
            <OtherProfileHeader
                scrollY={scrollY}
                account={thisAccount}
                goBack={() => navigation.goBack(null)}
                navigation={navigation}
            />
        </View>
    );
}

export default OtherAccountProfile;