import { Banner, HelperText, List, RadioButton, Text } from "react-native-paper"
import * as SecureStore from 'expo-secure-store';
import { useColorScheme, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import useTranslation from "@/localization";

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

    return (
        <View>
            <Banner
                visible={showBanner}
            >
                {t('Restart the application for theme settings to take effect')}
            </Banner>
            <List.Section
                title="Theme"
            >
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
                <List.Item
                    title={t('Light')}
                    right={() => (
                        <RadioButton
                            value="light"
                            status={current === 'light' ? 'checked' : 'unchecked'}
                            onPress={() => setCurrent('light')}
                        />
                    )}
                    onPress={() => setCurrent('light')}
                />
                <List.Item
                    title={t('Dark')}
                    right={() => (
                        <RadioButton
                            value="dark"
                            status={current === 'dark' ? 'checked' : 'unchecked'}
                            onPress={() => setCurrent('dark')}
                        />
                    )}
                    onPress={() => setCurrent('dark')}
                />
            </List.Section>
        </View>

    )
}

export default ThemeSettings
