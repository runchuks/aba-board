import GeneralSettings from "@/components/GeneralSettings";
import KidsSettings from "@/components/KidsSettings";
import LanguageSettings from "@/components/LanguageSettings";
import ParentalSettings from "@/components/ParentalSettings";
import SpeechSettings from "@/components/SpeechSettings";
import ThemeSettings from "@/components/ThemeSettings";
import useTranslation from "@/localization";
import useLock from "@/lock"
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useTheme, Text, Icon, Divider } from "react-native-paper";
import { useSelector } from "react-redux";

const SETTINGS_TABS = [
    {
        id: 1,
        title: 'Language',
        icon: 'translate',
        content: (): React.ReactNode => <LanguageSettings />
    },
    {
        id: 2,
        title: 'Parental',
        icon: 'account-supervisor',
        content: (): React.ReactNode => <ParentalSettings />
    },
    {
        id: 3,
        title: 'Speech',
        icon: 'account-voice',
        content: (): React.ReactNode => <SpeechSettings />
    },
    {
        id: 4,
        title: 'Appearance',
        icon: 'theme-light-dark',
        content: (): React.ReactNode => <ThemeSettings />
    }
]

const Settings = () => {
    const { lang } = useSelector(state => state.global)
    const { unlocked, LockScreen } = useLock();
    const navigation = useNavigation()
    const t = useTranslation()
    const theme = useTheme()

    const [activeTab, setActiveTab] = useState<number>(1)

    useEffect(() => {
        navigation.setOptions({ title: t('Settings') });
    }, [lang])

    const tabTitles = SETTINGS_TABS.map((setting, index) => {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                    paddingVertical: 10,
                    paddingLeft: 40,
                    backgroundColor: activeTab === setting.id ? theme.colors.elevation.level3 : 'transparent'
                }}
                onPress={() => setActiveTab(setting.id)}
            >
                <Icon size={24} source={setting.icon} />
                <Text variant="labelLarge">{t(setting.title)}</Text>
                {index === SETTINGS_TABS.length - 1 && (
                    <Divider />
                )}
            </TouchableOpacity>
        )
    })

    const tabContents = SETTINGS_TABS.map((setting, index) => {
        return (
            <View
                style={{
                    display: setting.id === activeTab ? 'flex' : 'none'
                }}
            >
                {setting.content()}
            </View>
        )
    })



    if (!unlocked) return LockScreen;


    return (
        <View style={[style.wrap, { backgroundColor: theme.colors.background }]}>

            <View style={[style.tabsTitlesWrap, { backgroundColor: theme.colors.elevation.level1 }]}>
                <ScrollView>
                    {tabTitles}
                </ScrollView>
            </View>
            <View style={style.tebContentWrap}>
                {tabContents}
            </View>

            {/* <ScrollView style={{ width: '100%' }}>
                <View style={{ alignItems: "center" }}>
                    <View style={style.innerWrap}>
                        <GeneralSettings />
                        <KidsSettings />
                    </View>
                </View>
            </ScrollView> */}
        </View>
    )
}

const style = StyleSheet.create({
    wrap: {
        width: '100%',
        height: '100%',
        flexDirection: 'row'
    },
    innerWrap: {
        width: 400,
        marginBottom: 50,
    },
    tabsTitlesWrap: {
        width: 300,
        height: '100%',
    },
    tebContentWrap: {
        flex: 1,
        height: '100%'
    }
})

export default Settings
