import { StyleSheet } from "react-native";
import Colors from "../../../utilities/Colors";

export default StyleSheet.create({
    container: {
        backgroundColor: Colors.whiteBackground,
        width:"100%",
        height:"100%",
        alignItems:"center",
    },
    formContainer: {
        backgroundColor:"#FFFFFFFF",
        width:"80%",
        flex:0.40,
        padding: 10,
        alignItems:"center",
        justifyContent:"space-evenly",
        borderRadius: 20,
        shadowColor:"#000000",
        shadowRadius:10,
        shadowOffset: { width:5, height:3 },
        shadowOpacity:0.5,
    },
    TextInputStyle: {
        width:"80%",
        backgroundColor:Colors.whiteBackground,
        borderRadius: 20,
        paddingHorizontal:10,
        paddingVertical:5,
        color: Colors.purple1,
        fontFamily:"italic",
        borderColor: Colors.purple1,
        borderWidth:1
    },
    forgetAndSignUpContainer: {
        borderBottomWidth:1,
        borderColor:Colors.purple1,
        top:10,
        zIndex:10
    },
    forgetAndSignUpText: {
        fontFamily:"italic",
        color: Colors.purple1,
    },
    loginButtonContainer: { 
        marginTop: 50 ,
        width: 150,
        height: 40,
    },
    LinearGradientLoginButton: { 
        width:"100%",
        height:"100%",
        alignItems:"center",
        justifyContent:"center",
        borderRadius: 20,
        borderWidth:1,
        borderColor:"#FFFFFFFF"
    },
    animationsText: {
        fontFamily:"italic",
        color: Colors.purple1,
        fontSize:30,
        textAlign:"center",
        textShadowColor:Colors.blue1,
        textShadowOffset: { width:0, height:4 },
        textShadowRadius:2,
    },
    errorMessage: {
        marginBottom:30,
        fontFamily:"regular",
        color:"red",
        fontSize:18,
        textAlign:"center"
    }
});