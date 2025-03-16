import UserCard from "@/components/UserCard";
import SettingsButton from "@/components/SettingsButton";
import useTranslation from "@/localization";
import STORAGE from "@/storage";
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { User } from "@/types";
import { Card, Icon, useTheme, Text, Portal, Modal, TextInput, Button } from 'react-native-paper';


export default function Index() {
    const { lang } = useSelector(state => state.global)
    const navigation = useNavigation()
    const t = useTranslation()
    const theme = useTheme();

    const [users, setUsers] = useState<User[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false)
    const [tempUserName, setTempUserName] = useState<string>('');
    const [renameUserId, setRenameUserId] = useState<number | null>(null);

    const refreshUsers = () => {
        setRefreshing(true);
        STORAGE.fetchUsers().then((users) => {
            setUsers(users)
            setShowAddUserModal(false)
            setTempUserName('')
            setRenameUserId(null)
            setRefreshing(false)
        });
    }

    const addUser = () => {
        if (tempUserName) {
            if (renameUserId) {
                STORAGE.updateUserById(renameUserId, {
                    name: tempUserName
                }).then(() => {
                    refreshUsers()
                })
            } else {
                STORAGE.addUser({
                    name: tempUserName,
                    image: '',
                    advanced: false,
                    archived: false,
                }).then(() => {
                    refreshUsers()
                })
            }
        }
    }

    const onRename = useCallback((id: number, currentName: string) => {
        setRenameUserId(id)
        setTempUserName(currentName)
        setShowAddUserModal(true)
    }, [])

    useEffect(() => {
        navigation.setOptions({
            title: t('Users'),
            headerRight: () => <SettingsButton />,
        });
    }, [lang, navigation, t])

    useEffect(() => {
        refreshUsers()
    }, [navigation])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refreshUsers()
        });

        return unsubscribe;
    }, [navigation]);


    const renderKids = useMemo(() => {
        return users.map(user => <UserCard
            {...user}
            onRename={onRename}
            key={user.id}
            refreshUsers={refreshUsers}
        />)
    }, [users, onRename])

    return (
        <View style={{ backgroundColor: theme.colors.background, height: '100%' }}>
            <ScrollView
                style={style.scrollWrap}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={refreshUsers} />
                }
            >
                <View style={[style.wrap]}>
                    {renderKids}
                    <Card
                        mode="outlined"
                        onPress={() => setShowAddUserModal(true)}
                        onLongPress={() => { }}
                        contentStyle={{
                            paddingVertical: 20,
                            paddingHorizontal: 10,
                            width: 120,
                            height: 120,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: theme.roundness
                        }}>
                        <Icon
                            source="account-plus-outline"
                            size={50}
                        />
                    </Card>
                </View>
            </ScrollView>
            <Portal>
                <Modal
                    visible={showAddUserModal}
                    onDismiss={() => setShowAddUserModal(false)}
                    contentContainerStyle={{
                        backgroundColor: theme.colors.background,
                        padding: 20,
                        width: 400,
                    }}
                    style={{
                        alignItems: 'center'
                    }}
                >
                    <View>
                        <TextInput
                            value={tempUserName}
                            onChangeText={setTempUserName}
                            label={t('Username')}
                        />
                        <Button
                            mode="contained"
                            style={{ marginTop: 20 }}
                            onPress={addUser}
                        >
                            {t(renameUserId ? 'Save user' : 'Add user')}
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
}

const style = StyleSheet.create({
    wrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 20,
        padding: 20
    },
    scrollWrap: {
        width: '100%'
    }
})
