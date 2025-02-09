import STYLES from "@/constants/styles";
import useTranslation from "@/localization";
import { setKids } from "@/store/slices/global";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, TextInput, Button, StyleSheet, Alert, Keyboard } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from 'expo-secure-store';
import { DEFAULT_STARTER_BOARD } from "@/constants/global";

const EditKid = () => {
    const { kids } = useSelector(state => state.global)
    const dispatch = useDispatch()
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter()
    const t = useTranslation()

    const [name, setName] = useState('')
    const [resetBoardActive, setResetBoardActive] = useState(true);

    useEffect(() => {
        const findKid = kids.find(kid => kid.id === Number(id))
        if (findKid) {
            setName(findKid.name)
        } else {
            router.back()
        }
    }, [id, navigation]);

    useEffect(() => {
        if (name) {
            navigation.setOptions({ title: `${t('Edit user')}: ${name}` });
        }
    }, [name])

    const edit = () => {
        Keyboard.dismiss();
        const newKid = {
            id: Number(id),
            name,
        }
        const newArray = kids.map(kid => 
            kid.id === Number(id) 
                ? { ...kid, ...newKid }  // Merge new data into the matched object
                : kid
        );
        dispatch(setKids(newArray));
        Alert.alert(t('User edited'),'',[
            {
                text: t('Ok'),
                onPress: () => {},
            },
            {
                text: t('Back to settings'),
                onPress: () => router.back(),
            },
        ])
    }

    const deleteUser = () => {
        Alert.alert(t('Delete user?'), '',[
            {
                text: t('Cancel'),
                onPress: () => {},
            },
            {
                text: t('Delete'),
                onPress: async () => {
                    const newKidArray = kids.filter(kid => kid.id !== Number(id));
                    dispatch(setKids(newKidArray))
                    SecureStore.deleteItemAsync(`board-${id}`).then(() => {
                        router.back()
                    })
                    .catch(() => {
                        router.back()
                    })
                    
                },
                style: "destructive"
            },
        ])
    }

    const reset = () => {
        Alert.alert(t('Reset board?'), '',[
            {
                text: t('Cancel'),
                onPress: () => {},
            },
            {
                text: t('Reset'),
                onPress: () => {
                    SecureStore.setItem(`board-${id}`, JSON.stringify(DEFAULT_STARTER_BOARD))
                    setResetBoardActive(false);
                },
                style: "destructive"
            },
        ])
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
                <View style={{marginTop: 20, gap: 10}}>
                    <Button title={t('Edit')} onPress={edit} />
                    <Button title={t('Reset board')} color="orange" onPress={reset} disabled={!resetBoardActive} />
                    <Button title={t('Delete')} onPress={deleteUser} color="red" />
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

export default EditKid
