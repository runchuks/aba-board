import STYLES from "@/constants/styles"
import useTranslation from "@/localization"
import STORAGE from "@/storage"
import { setKids } from "@/store/slices/global"
import { useNavigation, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Text, StyleSheet, View, TextInput, Button, Alert } from "react-native"
import { useDispatch, useSelector } from "react-redux"

const AddKid = () => {
    const {kids, lang} = useSelector(state => state.global)
    const navigation = useNavigation()
    const t = useTranslation()
    const dispatch = useDispatch()
    const router = useRouter()
    const [name, setName] = useState('')

    useEffect(() => {
        navigation.setOptions({ title: t('Add user') });
    }, [lang])

    const add = async () => {
        if (!name) {
            Alert.alert(t('Can`t add nameless user'))
            return
        }

        STORAGE.addUser({
            name,
            image: '',
            advanced: false,
            archived: false,
        }).then(() => {
            router.back()
        })
        
    }

    return (
        <View style={style.wrap}>
            <View style={style.innerWrap}>
                <View style={STYLES.inputWrap}>
                    <Text style={STYLES.inputLabel}>{t('Name')}</Text>
                    <TextInput
                        onChangeText={setName}
                        value={name}
                        style={STYLES.input}
                    />
                </View>
                <View style={{marginTop: 20}}>
                    <Button title={t('Add')} onPress={add} />
                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    wrap: {
        alignItems: "center",
        width: '100%',
    },
    innerWrap: {
        width: 400,
    },
    input: {
        borderWidth: 1,
        width: 100,
        textAlign: 'center',
        marginVertical: 10
    },
})

export default AddKid
