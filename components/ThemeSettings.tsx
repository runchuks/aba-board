import { Banner, HelperText, List, RadioButton, Text } from "react-native-paper"
import * as SecureStore from 'expo-secure-store';
import { ScrollView, useColorScheme, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import useTranslation from "@/localization";
import { THEMES } from "@/constants/global";

const ThemeSettings = () => {

    const colorScheme = useColorScheme();
    const schema = SecureStore.getItem('themeColorSchema')
    const t = useTranslation()
    const firstRender = useRef(true)

    const [current, setCurrent] = useState<string>(schema || 'auto')
    const [showBanner, setShowBanner] = useState(false)


    useEffect(() => {
        SecureStore.setItem('themeColorSchema', current)
        if (!firstRender.current) {
            setShowBanner(true)
        }
        firstRender.current = false
    }, [current])

    const themesRender = THEMES.map(theme => (
        <List.Item
            title={t(theme.title)}
            key={theme.value}
            right={() => (
                <RadioButton
                    value={theme.value}
                    status={current === theme.value ? 'checked' : 'unchecked'}
                    onPress={() => setCurrent(theme.value)}
                />
            )}
            onPress={() => setCurrent(theme.value)}
        />
    ))

    return (
        <View
            style={{
                paddingBottom: showBanner ? 105 : 0

            }}
        >
            <Banner
                visible={showBanner}
            >
                {t('Restart the application for theme settings to take effect')}
            </Banner>
            <ScrollView>
                <List.Item
                    title={() => (
                        <View>
                            <Text>{t('Automatic')}</Text>
                            <HelperText type="info">
                                {t('Current color scheme')}: {colorScheme}
                            </HelperText>
                        </View>
                    )}
                    right={() => (
                        <RadioButton
                            value="auto"
                            status={current === 'auto' ? 'checked' : 'unchecked'}
                            onPress={() => setCurrent('auto')}
                        />
                    )}
                    onPress={() => setCurrent('auto')}
                />
                {themesRender}
            </ScrollView>
        </View>

    )
}

export default ThemeSettings
