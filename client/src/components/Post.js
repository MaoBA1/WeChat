import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Colors from '../utilities/Colors';
import Swiper from 'react-native-swiper';
import { Video } from 'expo-av';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';


function Post({
    post,
    setPostForCommentModal,
    setCommentModalVisible
}) {
    const userSelector = useSelector(state => state.Reducer.User);
    const socket = useSelector(state => state.Reducer.Socket);
    const friends = userSelector?.friends;

    const like = () => {
        socket?.emit("give_like_to_post", {postId: post._id, account: userSelector._id, accountFriends: friends.map(f => f._id)});
    }

    const unlike = () => {
        socket?.emit("unlike_post", {postId: post._id, account: userSelector._id, accountFriends: friends.map(f => f._id)});
    }

    const isLiked = () => {
        return post?.likes?.filter(l => l?._id === userSelector?._id).length === 1;

    }

    return (  
        <View style={{
            backgroundColor: "#FFFFFFFF",
            width:"100%",
            marginTop:10
        }}>
            <View style={{
                flexDirection:"row",
                padding:10,
                justifyContent:"space-between",
                alignItems:"center"
            }}>
                <View style={{
                    flexDirection:"row",
                    alignItems:"center",
                }}>
                    <Image
                        source={{ uri: post?.postAuthor?.profileImage }}
                        style={{
                            width:45,
                            height:45,
                            borderRadius:50
                        }}
                    />
                    <Text style={{
                        marginLeft:10,
                        fontFamily:"regular",
                        color: Colors.purple1,
                        fontSize:18
                    }}>
                        {post?.postAuthor?.fname + " " + post?.postAuthor?.lname}
                    </Text>
                </View>

                <View>
                    <Text style={{
                        fontFamily:"italic",
                        color:"grey",
                        fontSize:12
                    }}>
                        {new Date(post?.creatAdt).toDateString()}
                    </Text>
                </View>
            </View>
            <View style={{
                alignSelf:"center",
                width:"90%"
            }}>
                <Text style={{
                    fontFamily:"regular",
                    fontSize:15
                }}>
                    {post?.postContent}
                </Text>
            </View>
            {
                post?.postMedia?.mediaExist &&
                <View>
                    {
                        post?.postMedia?.media?.length === 1 ? 
                        (
                            <>
                                {
                                    post?.postMedia?.media[0]?.mediaType === "image" ?
                                    (
                                        <Image
                                            source={{ uri: post?.postMedia?.media[0]?.downloadUrl }}
                                            style={{
                                                width:"100%",
                                                height:300,
                                                resizeMode:"contain",
                                                marginTop:10
                                            }}
                                        />
                                    )
                                    :
                                    (
                                        <Video
                                            source={{ uri: post?.postMedia?.media[0]?.downloadUrl }}
                                            style={{
                                                width:"100%",
                                                height:300,
                                                marginTop:10
                                            }}
                                            resizeMode="cover"
                                            posterStyle={{alignSelf:'stretch'}}
                                            useNativeControls 
                                        />
                                    )
                                }
                            </>
                        )
                        :
                        (
                            <Swiper 
                                loop={false}
                                style={{
                                    height:350
                                }}
                            >
                                {
                                    post?.postMedia?.media?.map((item, index) => {
                                        if(item?.mediaType === "image") {
                                            return (
                                                <Image
                                                    key={index}
                                                    source={{ uri: item?.downloadUrl }}
                                                    style={{
                                                        width:"100%",
                                                        height:300,
                                                        resizeMode:"contain",
                                                        marginTop:10
                                                    }}
                                                />
                                            )
                                        }
                                        return (
                                            <Video
                                                key={index}
                                                source={{ uri: item?.downloadUrl }}
                                                style={{
                                                    width:"100%",
                                                    height:300,
                                                    marginTop:10
                                                }}
                                                resizeMode="cover"
                                                posterStyle={{alignSelf:'stretch'}}
                                                useNativeControls 
                                            />
                                        )
                                    })
                                }
                            </Swiper>
                        )
                    }
                </View>
            }
            <View style={{
                marginTop:15,
            }}>
                <View style={{
                    flexDirection:"row",
                    padding:10
                }}>
                    <View style={{
                        flexDirection:"row",
                        alignItems:"center"
                    }}>
                        <AntDesign
                            name='like1'
                            color={"grey"}
                            size={15}
                        />
                        <Text style={{
                            marginLeft:2,
                            fontFamily:"italic",
                            fontSize:12,
                            color:"grey"
                        }}>
                            {post.likes.length + " likes"}
                        </Text>    
                    </View>

                    <View style={{
                        flexDirection:"row",
                        alignItems:"center",
                        marginLeft:10
                    }}>
                        <FontAwesome
                            name='comment'
                            color={"grey"}
                            size={15}
                        />
                        <Text style={{
                            marginLeft:2,
                            fontFamily:"italic",
                            fontSize:12,
                            color:"grey"
                        }}>
                            {post.comments.length + " comments"}
                        </Text>
                    </View>
                </View>

                <View style={{
                    flexDirection:"row",
                    borderTopWidth:0.5,
                    borderColor:"grey",
                    height:50
                }}>
                    <TouchableOpacity style={{
                        flexDirection:"row",
                        alignItems:"center",
                        justifyContent:"center",
                        width:"50%",
                        borderRightWidth:0.20,
                        borderColor:"grey"
                    }} onPress={!isLiked() ? like : unlike}>
                        {
                            isLiked() ?
                            (
                                <AntDesign
                                    name='dislike1'
                                    color={Colors.purple1}
                                    size={15}
                                />
                            )
                            :
                            (
                                <AntDesign
                                    name='like1'
                                    color={Colors.purple1}
                                    size={15}
                                />
                            )
                        }
                        <Text style={{
                            marginLeft:2,
                            fontFamily:"italic",
                            fontSize:12,
                            color:Colors.purple1
                        }}>
                            {isLiked() ? "unlike" : "like"}
                        </Text>    
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        flexDirection:"row",
                        alignItems:"center",
                        justifyContent:"center",
                        borderLeftWidth:0.20,
                        borderColor:"grey",
                        width:"50%"
                    }} onPress={() => {
                        setPostForCommentModal();
                        setCommentModalVisible(true);
                    }}>
                        <FontAwesome
                            name='comment'
                            color={Colors.purple1}
                            size={15}
                        />
                        <Text style={{
                            marginLeft:2,
                            fontFamily:"italic",
                            fontSize:12,
                            color:Colors.purple1
                        }}>
                            {"comments"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


export default Post;