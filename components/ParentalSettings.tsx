import useTranslation from "@/localization"
import { RootState } from "@/store"
import { setLocked, setMasterPin } from "@/store/slices/global"
import { View } from "react-native"
import { List, Switch, TextInput } from "react-native-paper"
import { useDispatch, useSelector } from "react-redux"

const ParentalSettings = () => {
    const { locked, masterPin } = useSelector((state: RootState) => state.global)
    const dispatch = useDispatch()

    const t = useTranslation()

    const onToggleSwitch = () => {
        dispatch(setLocked(!locked))
    }

    return (
        <View>
            <List.Item
                title={t('Locked with PIN')}
                right={() => (
                    <Switch value={locked} onValueChange={onToggleSwitch} />
                )}
            />
            <List.Item
                title={t('PIN')}
                right={() => (
                    <TextInput
                        style={{ flex: 1 }}
                        value={masterPin}
                        onChangeText={value => dispatch(setMasterPin(value))}
                        keyboardType="number-pad"
                        keyboardAppearance="light"
                        right={<TextInput.Icon icon="lock-outline" />}
                    />
                )}
            />
        </View>
    )
}

export default ParentalSettings
