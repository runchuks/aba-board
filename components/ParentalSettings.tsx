import useTranslation from "@/localization"
import { RootState } from "@/store"
import { setLocked, setMasterPin, setQuickAddEnabled, setAutoPlayDefaultValue } from "@/store/slices/global"
import { ScrollView, View } from "react-native"
import { List, Switch, TextInput } from "react-native-paper"
import { useDispatch, useSelector } from "react-redux"

const ParentalSettings = () => {
    const { locked, masterPin, quickAddEnabled, autoPlayDefaultValue } = useSelector((state: RootState) => state.global)
    const dispatch = useDispatch()

    const t = useTranslation()

    const onToggleSwitch = () => {
        dispatch(setLocked(!locked))
    }

    const onToggleQuickAdd = () => {
        dispatch(setQuickAddEnabled(!quickAddEnabled))
    }

    const onToggleAutoPlayDefaultValue = () => {
        dispatch(setAutoPlayDefaultValue(!autoPlayDefaultValue))
    }

    return (
        <ScrollView style={{ paddingBottom: 65 }}>
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
            <List.Item
                title={t('Quick add enabled')}
                right={() => (
                    <Switch value={quickAddEnabled} onValueChange={onToggleQuickAdd} />
                )}
            />
            <List.Item
                title={t('Auto play default value')}
                right={() => (
                    <Switch value={autoPlayDefaultValue} onValueChange={onToggleAutoPlayDefaultValue} />
                )}
            />
        </ScrollView>
    )
}

export default ParentalSettings
