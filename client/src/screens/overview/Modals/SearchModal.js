import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableWithoutFeedback, Keyboard, FlatList, Image, TouchableOpacity } from 'react-native';
import Colors from '../../../utilities/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

function SearchModal({ visible, setIsVisible, navigate }) {
    const socket = useSelector(state => state.Reducer.Socket);
    const userSelector = useSelector(state => state.Reducer.User);

    const [ keywordSearch, setKeywordSearch ] = useState("");
    const [ searchResults, setSearchResults ] = useState([]);
    useEffect(() => {
        socket?.on("get_accounts_by_search_keyword", (response) => setSearchResults(response.accounts?.filter(a => a._id !== userSelector?._id)));

        return () => {
            socket?.off("get_accounts_by_search_keyword", setSearchResults);
        }
    },[])
     
    
    
    return (  
        <Modal
            visible={visible}
            transparent
            animationType='slide'
        >
            <View style={{
                flex:1,
                backgroundColor:Colors.whiteBackground
            }}>
                <View style={{
                    flex:0.1,
                    backgroundColor:"#FFFFFFFF",
                    justifyContent:"flex-end"
                }}>
                    <View style={{
                        flexDirection:"row",
                        justifyContent:"space-between",
                        backgroundColor:"#FFFFFFFF",
                        alignItems:"flex-end",
                        borderBottomWidth:1,
                        borderColor:"grey"
                    }}>
                        <TextInput
                            style={{
                                width:"85%",
                                height:35,
                                backgroundColor:"#FFFFFFFF",
                                fontFamily:"italic",
                                fontSize:15,
                                paddingHorizontal:10
                            }}
                            placeholder='Search for any contacts...'
                            value={keywordSearch}
                            onChangeText={text => setKeywordSearch(text)}
                            onChange={() => socket?.emit("get_accounts_by_search_keyword", { keyword: keywordSearch })}
                        />
                        <TouchableOpacity
                            style={{
                                marginRight:10,
                                marginBottom:10,
                                width:35,
                                height:35,
                                backgroundColor: Colors.purple1,
                                borderRadius:50,
                                alignItems:"center",
                                justifyContent:"center",
                                zIndex:1
                            }}
                            onPress={() => {
                                setKeywordSearch("");
                                setSearchResults([]);
                                setIsVisible(false)
                            }}
                        >
                            <FontAwesome
                                name='close'
                                color={"#FFFFFFFF"}
                                size={20}
                                onPress={() => {
                                    setKeywordSearch("");
                                    setSearchResults([]);
                                    setIsVisible(false)
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                >
                    <View style={{
                        flex:0.9
                    }}>
                        <FlatList
                            data={searchResults}
                            keyExtractor={item => item._id}
                            renderItem={({ item, index }) => 
                                <TouchableOpacity
                                    style={{
                                        backgroundColor:"#FFFFFFFF",
                                        flexDirection:"row",
                                        padding:10,
                                        height:70,
                                        alignItems:"center",
                                        borderBottomWidth:0.5,
                                        borderColor:"grey",
                                    }}
                                    onPress={() => {
                                        setIsVisible(false);
                                        setKeywordSearch("");
                                        setSearchResults([]);
                                        navigate("OtherProfile", { accountId: item?._id });
                                    }}
                                >
                                    <Image
                                        source={{ uri: item?.profileImage }}
                                        style={{
                                            width:35,
                                            height:35,
                                            borderRadius:50
                                        }}
                                    />
                                    <Text
                                        style={{
                                            fontFamily:"regular",
                                            marginLeft:10,
                                            color: Colors.purple1
                                        }}
                                    >
                                        {item?.fname + " " + item?.lname}
                                    </Text>
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </Modal>
    );
}

export default SearchModal;