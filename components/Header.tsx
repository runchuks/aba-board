import { View } from "react-native";
import { Appbar, Text } from "react-native-paper"

const Header = (props) => {

    return (
        <Appbar.Header
            style={{
                justifyContent: "space-between"
            }}
            elevated
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >
                {props.navigation.canGoBack() && (
                    <Appbar.Action icon="arrow-left" onPress={() => props.navigation.goBack()} style={{ marginRight: 10 }} />
                )}
                <Text>
                    {props.options.title}
                </Text>
            </View>
            <View>
                {props.options.headerRight && props.options.headerRight()}
            </View>
        </Appbar.Header>
    )
}

export default Header
