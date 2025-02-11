import STYLES from "@/constants/styles"
import useTranslation from "@/localization"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Feather from '@expo/vector-icons/Feather'
import { useEffect, useMemo, useState } from "react"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useNavigation, useRouter } from "expo-router"
import STORAGE from "@/storage"
import moment from 'moment'
import Entypo from '@expo/vector-icons/Entypo'
import { User } from "@/types"

const KidsSettings = () => {
    const router = useRouter();

    const t = useTranslation()
    const navigation = useNavigation()

    const [users, setUsers] = useState<User[]>([]);

    const addUser = () => {
        router.navigate(`/add-kid`)
    }

    const openUser = (id: number) => {
        router.navigate(`/edit-kid/${id}`)
    }

    useEffect(() => {
        STORAGE.fetchUsers().then((users) => {
            setUsers(users)
        });
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            STORAGE.fetchUsers().then((users) => {
                setUsers(users)
            });
        });
    
        return unsubscribe;
    }, [navigation]);

    const renderUsers = useMemo(() => {
        if (!users) return null
        return users.map((user)=> (
            <TouchableOpacity style={style.kid} onPress={() => openUser(user.id)} key={user.id}>
                <View>
                    <Text style={{ marginRight: 10 }}>{user.name}</Text>
                    <Text style={{ fontSize: 6, color: 'grey'}}>
                        {user.id}
                        <Entypo name="dot-single" size={6} color="grey" />
                        {moment(user.added).format('DD.MM.YYYY')}
                    </Text>
                </View>
                
                <View>
                    <MaterialCommunityIcons name="pencil-outline" size={21} color="black" />
                </View>
            </TouchableOpacity>
        ))
    }, [users])

    return (
        <View>
            <Text style={STYLES.settingsHeader}>{t('User settings')}</Text>
            <TouchableOpacity style={style.addKid} onPress={addUser}>
                <Feather name="user-plus" size={21} color="black" />
                <Text style={{ marginLeft: 20 }}>{t('Add user')}</Text>
            </TouchableOpacity>
            {renderUsers}
        </View>
    )
}

const style = StyleSheet.create({
    addKid: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },
    kid: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 5
    }
})

export default KidsSettings
