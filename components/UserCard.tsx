import { FC } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from "expo-router";
import { User } from "@/types";
import { useTheme, Text } from "react-native-paper";

const UserCard: FC<User> = ({ id, name }) => {
    const router = useRouter()
    const theme = useTheme();

    const onPress = () => {
        router.navigate(`/board/${id}`)
    }

    return (
        <TouchableOpacity style={[style.wrap, { backgroundColor: theme.colors.primaryContainer }]} onPress={onPress} >
            <View style={style.imageWrap}>
                <AntDesign name="user" size={24} color="black" />
            </View>
            <Text style={style.name} numberOfLines={1}>{name}</Text>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    wrap: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        width: 200
    },
    imageWrap: {
        backgroundColor: "#dedede",
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    }
})

export default UserCard
