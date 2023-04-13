import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-community/masked-view";
import { Text } from "react-native-paper";
import Colors from "../utilities/Colors";



const GradientText = (props) => {
    return (
      <MaskedView maskElement={<Text {...props} />}>
        <LinearGradient
            colors={[Colors.blue1, Colors.purple1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        >
          <Text {...props} style={[props.style, { opacity: 0 }]} />
        </LinearGradient>
      </MaskedView>
    );
};


export default GradientText;