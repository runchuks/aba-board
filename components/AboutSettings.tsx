import { FC } from "react";
import { Image, View } from "react-native";
import { Text } from "react-native-paper";

const logoImage = require('@/assets/images/icon.png')

const AboutSettings: FC = () => {
    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 30
            }}
        >
            <Image
                source={logoImage}
                style={{ width: 50, height: 50, marginBottom: 20, marginTop: 20 }}
            />
            <Text>ABA Therpay board</Text>
            <Text>Version: 1.0.8</Text>
        </View>
    )
}

export default AboutSettings
