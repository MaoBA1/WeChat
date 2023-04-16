import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Colors from '../utilities/Colors';
import { Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// icons
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// screens
import Entry from '../screens/Entry';
import Login from '../screens/authentication/Login';
import Register from '../screens/authentication/Register';
import Home from '../screens/overview/Home';
import Profile from '../screens/overview/Profile';
import Messages from '../screens/overview/Messages';
import Friends from '../screens/overview/Friends';
import OtherAccountProfile from '../screens/overview/OtherAccountProfile';
import PrivateChat from '../screens/overview/PrivateChat';


const RootStackNavigator = createStackNavigator();
export const RootStack = () => {
    return(
        <RootStackNavigator.Navigator>
            <RootStackNavigator.Screen name='Entry' component={Entry} options={{ headerShown:false }}/>
            <RootStackNavigator.Screen name='Login' component={Login}/>
            <RootStackNavigator.Screen name='Register' component={Register} options={{ headerShown:false }}/>
            <RootStackNavigator.Screen name='OtherProfile' component={OtherAccountProfile} options={{ headerShown:false }}/>
            <RootStackNavigator.Screen name='PrivateChat' component={PrivateChat} options={{ headerShown:false }}/>
            <RootStackNavigator.Screen name="OverView" component={OverViewStack} options={{ headerShown:false }}/>
        </RootStackNavigator.Navigator>
    )
}


const OverViewBottomStackNavigator = createBottomTabNavigator();
export const OverViewStack = () => {
    return(
        <View style={{ flex: 1, position: 'relative' }}>
            <OverViewBottomStackNavigator.Navigator
                screenOptions={{
                    tabBarShowLabel:false,
                    tabBarStyle:{ backgroundColor:"transpernt" },
                }}
            >
                
                <OverViewBottomStackNavigator.Screen
                    options = {{
                        tabBarIcon:({focused,color,size}) => {
                            const iconColor = '#ffffff'
                            const iconSzie = focused? 28 : 24
                            const iconOpacity = focused? 1 : 0.5
                            return(
                            <Entypo 
                                name={'home'}
                                color={iconColor}
                                size={iconSzie}
                                style={{ opacity: iconOpacity }}
                            />
                            )
                
                        },   
                        headerShown:false
                    }} 
                    name='Home'
                    component={Home}
                    
                />
                <OverViewBottomStackNavigator.Screen
                    options = {{
                        tabBarIcon:({focused,color,size}) => {
                            const iconColor = '#ffffff'
                            const iconSzie = focused? 28 : 24
                            const iconOpacity = focused? 1 : 0.5
                            return(
                            <Ionicons 
                                name={'person'}
                                color={iconColor}
                                size={iconSzie}
                                style={{ opacity: iconOpacity }}
                            />
                            )
                
                        },  
                        headerShown:false 
                    }} 
                    name='Profile'
                    component={Profile}
                    
                />
                <OverViewBottomStackNavigator.Screen
                    options = {{
                        tabBarIcon:({focused,color,size}) => {
                            const iconColor = '#ffffff'
                            const iconSzie = focused? 28 : 24
                            const iconOpacity = focused? 1 : 0.5
                            return(
                            <FontAwesome5 
                                name={'user-friends'}
                                color={iconColor}
                                size={iconSzie}
                                style={{ opacity: iconOpacity }}
                            />
                            )
                
                        }, 
                        headerShown: false  
                    }} 
                    name='Freinds'
                    component={Friends}
                    
                />
                <OverViewBottomStackNavigator.Screen
                    options = {{
                        tabBarIcon:({focused,color,size}) => {
                            const iconColor = '#ffffff'
                            const iconSzie = focused? 28 : 24
                            const iconOpacity = focused? 1 : 0.5
                            return(
                            <Ionicons 
                                name={'chatbubble-ellipses'}
                                color={iconColor}
                                size={iconSzie}
                                style={{ opacity: iconOpacity }}
                            />
                            )
                
                        },  
                        headerShown: false 
                    }} 
                    name='Messages'
                    component={Messages}
                    
                />
            </OverViewBottomStackNavigator.Navigator>
            <LinearGradient
                colors={[Colors.blue1, Colors.purple1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    height: Platform.OS === 'ios' ? 70 : 60,
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    zIndex: -1, 
                }}
            />
        </View>
    )
}