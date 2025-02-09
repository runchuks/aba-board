import STYLES from "@/constants/styles"
import useTranslation from "@/localization"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { setKids } from "@/store/slices/global";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from "expo-router";

const KidsSettings = () => {

    const { kids } = useSelector(state => state.global);
    const dispatch = useDispatch()
    const router = useRouter();

    const t = useTranslation()

    const addKid = () => {
        // dispatch(setKids([...kids, { id: 101, name: 'test' }]))
        router.navigate(`/add-kid`)
    }

    const openKid = (id) => {
        router.navigate(`/edit-kid/${id}`)
    }

    const renderKids = useMemo(() => {
        if (!kids) return null
        return kids.map((kid)=> (
            <TouchableOpacity style={style.kid} onPress={() => openKid(kid.id)} key={kid.id}>
                <View>
                    <Text style={{ marginRight: 10 }}>{kid.name}</Text>
                    <Text style={{ fontSize: 6, color: 'grey'}}>{kid.id}</Text>
                </View>
                
                <View>
                    <MaterialCommunityIcons name="pencil-outline" size={24} color="black" />
                </View>
            </TouchableOpacity>
        ))
    }, [kids])

    return (
        <View>
            <Text style={STYLES.settingsHeader}>{t('User settings')}</Text>
            <TouchableOpacity style={style.addKid} onPress={addKid}>
                <Feather name="user-plus" size={24} color="black" />
                <Text style={{ marginLeft: 20 }}>{t('Add user')}</Text>
            </TouchableOpacity>
            {renderKids}
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
