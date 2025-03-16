import { FC, useState } from "react"
import { StyleSheet } from "react-native"
import { useRouter } from "expo-router";
import { User } from "@/types";
import { Text, Avatar, Card, useTheme, Menu, Divider, Portal, Dialog, Button } from "react-native-paper";
import useTranslation from "@/localization";
import STORAGE from "@/storage";

const UserCard: FC<User> = ({ id, name, onRename, refreshUsers }) => {
    const t = useTranslation()
    const router = useRouter()
    const theme = useTheme()

    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

    const onPress = () => {
        router.navigate(`/board/${id}`)
    }

    const handleRename = (): void => {
        onRename(id, name)
        setShowMenu(false)
    }

    const handleDelete = (): void => {
        STORAGE.deleteUserById(id).then(() => {
            setShowMenu(false)
            refreshUsers()
        })
    }

    const handleDeleteConfirmation = () => {
        setShowMenu(false)
        setShowDeleteDialog(true)
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
                {/* <Menu.Item onPress={() => { }} title={t('Take picture')} /> */}
                <Divider />
                <Menu.Item onPress={handleDeleteConfirmation} title={t('Delete')} />
            </Menu>
            <Text
                style={style.name}
                numberOfLines={1}
            >
                {name.trim()}
            </Text>
            <Portal>
                <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
                    <Dialog.Title>{t('Delete user')}</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">{t('Are you sure you want to delete this user?')}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowDeleteDialog(false)}>{t('Cancel')}</Button>
                        <Button onPress={handleDelete}>{t('Delete')}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
