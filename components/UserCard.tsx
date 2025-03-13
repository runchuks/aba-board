import { FC, useState } from "react"
import { StyleSheet } from "react-native"
import { useRouter } from "expo-router";
import { User } from "@/types";
import { Text, Avatar, Card, useTheme, Menu, Divider } from "react-native-paper";
import useTranslation from "@/localization";

const UserCard: FC<User> = ({ id, name, onRename }) => {
    const t = useTranslation()
    const router = useRouter()
    const theme = useTheme()

    const [showMenu, setShowMenu] = useState<boolean>(false);

    const onPress = () => {
        router.navigate(`/board/${id}`)
    }

    const handleRename = (): void => {
        onRename(id, name)
        setShowMenu(false)
    }

    return (
        <Card
            onPress={onPress}
            contentStyle={{
                paddingVertical: 20,
                paddingHorizontal: 10,
                width: 120,
                height: 120,
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: theme.roundness
            }}
            onLongPress={() => setShowMenu(true)}
        >

            <Menu
                visible={showMenu}
                onDismiss={() => setShowMenu(false)}
                anchor={(
                    <Avatar.Icon
                        icon="account-outline"
                        size={50}
                        color={theme.colors.onPrimary}
                    />
                )}

            >
                <Menu.Item onPress={handleRename} title={t('Rename')} />
                <Menu.Item onPress={() => { }} title={t('Take picture')} />
                <Divider />
                <Menu.Item onPress={() => { }} title={t('Delete')} />
            </Menu>
            <Text
                style={style.name}
                numberOfLines={1}
            >
                {name.trim()}
            </Text>
        </Card>
    )
}

const style = StyleSheet.create({
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
