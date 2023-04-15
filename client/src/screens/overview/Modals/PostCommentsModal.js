import React, { useState } from 'react';
import { Modal, TouchableOpacity, View, Image, Text, FlatList, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, Platform } from 'react-native';
import Colors from '../../../utilities/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';

function PostCommentsModal({
    post,
    visible, 
    setVisible,
    cleanPost
}) {
    const socket = useSelector(state => state.Reducer.Socket);
    const userSelector = useSelector(state => state.Reducer.User);
    const friends = userSelector?.friends;
    const [ comment, setComment ] = useState("");
    const closeModal = () =>{
        cleanPost();
        setVisible(false);
    }
    const sendComment = () => {
        if(comment === "") return;
        socket?.emit("add_comment_to_post", { postId: post._id, comment: comment, account: userSelector, accountFriends: friends.map(f => f._id) });
        setComment("");
    }
    
    return (  
        <Modal
            visible={visible}
            transparent
            animationType="slide"
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS === "android" && 10} behavior="height" style={{
                    flex:1, 
                    backgroundColor: Colors.whiteBackground,
                    justifyContent:"space-between"
                }}>
                    <View style={{
                        flex:1,
                        backgroundColor: Colors.whiteBackground
                    }}>
                    
                        <TouchableOpacity style={{
                            width:30,
                            height:30,
                            borderRadius:50,
                            backgroundColor: Colors.purple1,
                            alignItems:"center",
                            justifyContent:"center",
                            position:"absolute",
                            top:15, 
                            right:15,
                            zIndex:1
                        }} onPress={closeModal}>
                            <FontAwesome
                                name='close'
                                size={20}
                                color={"#FFFFFFFF"}
                            />
                        </TouchableOpacity>

                        <View style={{
                            borderBottomWidth:0.5,
                            borderColor:"grey",
                            marginTop:50
                        }}>
                            <View style={{
                                flexDirection:"row",
                                padding:10,
                                justifyContent:"space-between",
                                alignItems:"center",
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
                            <Text style={{
                                fontFamily:"regular",
                                fontSize:15,
                                marginLeft:20,
                                marginBottom:20
                            }}>
                                {post?.postContent}
                            </Text>
                    
                        </View>
                        {
                            <FlatList
                                data={post?.comments?.sort((a, b) => (new Date(b.creatAdt) - new Date(a.creatAdt)))}
                                keyExtractor={item => item.creatAdt}
                                renderItem={({item, index}) => 
                                    <View
                                        key={index}
                                        style={{
                                            width:"100%",
                                            backgroundColor:"#FFFFFF",
                                            borderBottomWidth:0.5,
                                            borderColor:"grey",
                                            padding:10
                                        }}
                                    >
                                        <View style={{
                                            flexDirection:"row",
                                            alignItems:"center",
                                            justifyContent:"space-between"
                                        }}>
                                            <View style={{
                                                flexDirection:"row",
                                                alignItems:"center"
                                            }}>
                                                <Image
                                                    source={{ uri: item?.commentAuthor?.profileImage }}
                                                    style={{
                                                        width:30,
                                                        height:30,
                                                        borderRadius:50
                                                    }}
                                                />
                                                <Text style={{
                                                    fontFamily:"regular",
                                                    color: Colors.blue1,
                                                    marginLeft:5
                                                }}>
                                                    {item?.commentAuthor?.fname + " " + item?.commentAuthor?.lname}
                                                </Text>
                                            </View>
                                            <Text style={{
                                                fontFamily:"italic",
                                                color:"grey",
                                                fontSize:12
                                            }}>
                                                {new Date(item?.creatAdt).toDateString()}
                                            </Text>
                                        </View>
                                        <Text style={{
                                            fontFamily:"italic",
                                            marginTop:10,
                                            marginLeft:10
                                        }}>
                                            {item?.comment}
                                        </Text>
                                    </View>
                                }
                            />
                        }
                    </View>
                    
                    <LinearGradient 
                        colors={[Colors.blue1, Colors.purple1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            flexDirection:"row",
                            height:95,
                            alignItems:"center",
                            backgroundColor:Colors.purple1,
                            justifyContent:"space-evenly",
                            position:"absolute",
                            bottom:0,
                            left:0,
                            width:"100%"
                        }}
                        
                    >
                        <TextInput
                            style={{
                                fontFamily:"regular",
                                width:"80%",
                                backgroundColor:"#FFFFFFFF",
                                height:"40%",
                                borderRadius:50,
                                paddingHorizontal:10,
                                color: Colors.purple1
                            }}
                            placeholder='comment...'
                            value={comment}
                            onChangeText={text => setComment(text)}
                        />
                        <TouchableOpacity style={{
                            backgroundColor:"#FFFFFFFF",
                            width:"13%",
                            alignItems:"center",
                            justifyContent:"center",
                            borderRadius:50,
                            height:"40%"
                        }} onPress={sendComment}>
                            <Text style={{
                                fontFamily:"italic",
                                color: Colors.purple1
                            }}>
                                Send
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

export default PostCommentsModal;