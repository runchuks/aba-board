import useTranslation from "@/localization"
import { RootState } from "@/store"
import { setSpeechSpeed } from "@/store/slices/global"
import Slider from "@react-native-community/slider"
import { useEffect, useState } from "react"
import { List, Text, useTheme } from "react-native-paper"
import { useDispatch, useSelector } from "react-redux"

const SpeechSettings = () => {
    const t = useTranslation()
    const { speechSpeed } = useSelector((state: RootState) => state.global)
    const dispatch = useDispatch();
    const theme = useTheme()


    const [innerSpeechSpeed, setInnerSpeechSpeed] = useState<number>(Number(speechSpeed))

    const handleSpeechSpeedChange = (value: number) => {
        dispatch(setSpeechSpeed(value))
    }

    useEffect(() => {
        console.log(innerSpeechSpeed)
    }, [innerSpeechSpeed])

    return (
        <List.Section
            title={`${t('Speech speed')}: ${innerSpeechSpeed}`}
        >
            <List.Item
                title={() => (
                    <Slider
                        style={{ width: '100%', height: 40, padding: 0, margin: 0 }}
                        minimumValue={0}
                        lowerLimit={10}
                        maximumValue={200}
                        upperLimit={220}
                        step={1}
                        value={speechSpeed}
                        onSlidingComplete={handleSpeechSpeedChange}
                        onValueChange={setInnerSpeechSpeed}
                        minimumTrackTintColor={theme.colors.primary}
                        maximumTrackTintColor={theme.colors.secondary}

                        thumbTintColor={theme.colors.primary}
                    />
                )}
            />
        </List.Section>
    )
}

export default SpeechSettings
