import GeneralSettings from "@/components/GeneralSettings";
import KidsSettings from "@/components/KidsSettings";
import useTranslation from "@/localization";
import useLock from "@/lock"
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native"
import { useSelector } from "react-redux";

const Settings = () => {
    const { lang } = useSelector(state => state.global)
    const { unlocked, LockScreen } = useLock();
    const navigation = useNavigation()
    const t = useTranslation()

    useEffect(() => {
        navigation.setOptions({ title: t('Settings') });
    }, [lang])

    if (!unlocked) return LockScreen;

    
    return (
        <View style={style.wrap}>
            <ScrollView style={{width: '100%'}}>
                <View style={{ alignItems: "center" }}>
                    <View style={style.innerWrap}>
                        <GeneralSettings />
                        <KidsSettings />
                    </View>
                </View>
            </ScrollView>
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
        marginBottom: 50,
    }
})

export default Settings
