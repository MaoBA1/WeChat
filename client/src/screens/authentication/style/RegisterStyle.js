import { StyleSheet } from "react-native";
import Colors from "../../../utilities/Colors";

export default StyleSheet.create({
    conatiner: {
        backgroundColor: Colors.whiteBackground,
        width:"100%",
        height:"100%"
    },
    backIconContainer: {
        height:80,
        justifyContent:"center",
        paddingLeft: 15
    },
    titleContainer: {
        marginTop:80,
        height:100,
        alignItems:"center"
    },
    title: {
        fontFamily:"regular",
        fontSize:50,
        textShadowColor:Colors.blue1,
        textShadowOffset: { width:0, height:5 },
        textShadowRadius:10,
    },
    note: {
        fontFamily:"regular",
        color:"red",
        position:"absolute",
        bottom:10,
        fontSize:15
    },
    formContainer: {
        width:"100%",
        alignItems:"center",
        height:250,
        justifyContent:"space-evenly"
    },
    emailAndPasswordTextInput: { 
        width:"80%",
        borderWidth:1,
        borderRadius:20,
        paddingVertical:8,
        paddingHorizontal:10,
        borderColor: Colors.purple1,
        color: Colors.purple1,
        fontFamily:"regular"
    },
    firstAndLastNameTextInput: { 
        width:"47%",
        borderWidth:1,
        borderRadius:20,
        paddingVertical:8,
        paddingHorizontal:10,
        borderColor: Colors.purple1,
        color: Colors.purple1,
        fontFamily:"regular"
    },
    imageContainer: {
        borderWidth:2,
        borderColor: Colors.purple1,
        width:100,
        height:100,
        alignSelf:"center",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:50,
        position:"relative",
        padding:1
    },
    editImageContainer: {
        width:30,
        height:30,
        borderRadius:50,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor: "grey",
        position:'absolute',
        top:0,
        right:-5,
        zIndex:1
    },
    deletIconContainer: {
        borderRadius:50,
        backgroundColor:"red",
        width:30,
        height:30,
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        zIndex:1,
        top: 0,
        left: -5
    },
    signUpButtonContainer: {
        width:100,
        padding:10,
        alignSelf:"center",
        top:20,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:20
    },
    signUpButtonText: {
        color: "#FFFFFFFF",
        fontFamily:"bold"
    },
    ModalContainer: {
        backgroundColor: Colors.whiteBackground,
        width:"100%",
        height:"100%",
        opacity: 0.5,
        alignItems:"center",
        justifyContent:"center",
    },
    ModalCard: {
        width:"80%",
        height:200,
        backgroundColor: Colors.purple1,
        zIndex:1,
        position:'absolute',
        alignSelf:"center",
        top:"30%",
        borderRadius:20,
        alignItems:"center",
        justifyContent:"center"
    },
    ModalText: {
        fontFamily:"regular",
        fontSize:18,
        color: "#FFFFFFFF",
        textAlign:"center"
    }
});