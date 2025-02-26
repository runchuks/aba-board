import { FC } from "react"
import { StyleSheet } from "react-native"
import { useRouter } from "expo-router";
import { User } from "@/types";
import { Text, Avatar, Card } from "react-native-paper";

const UserCard: FC<User> = ({ id, name }) => {
    const router = useRouter()

    const onPress = () => {
        router.navigate(`/board/${id}`)
    }

    return (
        <Card style={style.wrap} onPress={onPress}>
            <Avatar.Icon
                icon="account-outline"
                size={50}
            />
            <Text style={style.name} numberOfLines={1}>{name.trim()}</Text>
        </Card>
    )
}

const style = StyleSheet.create({
    wrap: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignItems: "center",
        width: 150,
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
        marginTop: 10,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    }
})

export default UserCard
