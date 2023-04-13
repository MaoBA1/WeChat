import React, { useState } from 'react';
import { 
    View,
    Text,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    Pressable,
    TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../utilities/Colors';
import GradientText from '../../components/GradientText';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from "expo-linear-gradient";
import RegisterStyle from './style/RegisterStyle';

function Register({ navigation }) {
    const [ note, setNote ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ fname, setFname ] = useState("");
    const [ lname, setLname ] = useState("");
    return (  
        <KeyboardAvoidingView behavior='position' style={{ flex:1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={RegisterStyle.conatiner}>
                    <View style={RegisterStyle.backIconContainer}>
                        <Ionicons
                            name='arrow-back'
                            size={30}
                            color={Colors.purple1}
                            onPress={() => navigation.goBack(null)}
                        />
                    </View>
                    <View>
                        <View style={RegisterStyle.titleContainer}>
                            <GradientText style={RegisterStyle.title}>
                                Register
                            </GradientText>
                            {
                                note !== "" && 
                                <Text style={RegisterStyle.note}>
                                    note
                                </Text>
                            }
                        </View>

                        <View style={RegisterStyle.formContainer}>
                            <TextInput
                                style={RegisterStyle.emailAndPasswordTextInput}
                                placeholder='Email Adress'
                            />
                            
                            <View style={{
                                flexDirection:"row",
                                width:"80%",
                                justifyContent:"space-between"
                            }}>
                                <TextInput
                                    style={RegisterStyle.firstAndLastNameTextInput}
                                    placeholder='First Name'
                                />

                                <TextInput
                                    style={RegisterStyle.firstAndLastNameTextInput}
                                    placeholder='Last Name'
                                />
                            </View>    
                            <TextInput
                                style={RegisterStyle.emailAndPasswordTextInput}
                                placeholder='Password'
                                secureTextEntry
                            />
                        </View>
                        
                        <View style={RegisterStyle.imageContainer}>
                            <TouchableOpacity style={RegisterStyle.editImageContainer}>
                                <MaterialIcons
                                    name="edit"
                                    color={"#FFFFFFFF"}
                                    size={15}
                                />
                            </TouchableOpacity>
                            <Entypo
                                name='camera'
                                color={Colors.purple1}
                                size={50}
                            />
                        </View>
                        
                    </View>
                    
                    <TouchableOpacity>
                        <LinearGradient 
                            colors={[Colors.blue1, Colors.purple1]}
                            style={RegisterStyle.signUpButtonContainer}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        > 
                            <Text style={RegisterStyle.signUpButtonText}>
                                Sigun - Up
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default Register;