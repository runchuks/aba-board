import useTranslation from "@/localization";
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { useEffect, useMemo } from "react";
import { useTheme, Text, Icon } from "react-native-paper";

interface Props {
    setPin: (value: string) => void,
    handleUnlock: () => void,
    pin: string,
    maxLenght: number
}

const LockScreen: React.FC<Props> = ({ setPin, handleUnlock, pin, maxLenght }) => {
    const t = useTranslation()
    const theme = useTheme()

    const maskedPin = useMemo(() => {
        const returnVals = [];
        for (let i = 0; i < pin.length; i++) {
            returnVals.push(
                <Icon source="circle-small" size={40} color={theme.colors.primary} key={i} />
            )
        }
        if (returnVals.length < maxLenght) {
            for (let i = returnVals.length; i < maxLenght; i++) {
                returnVals.push(
                    <Icon source="circle-small" size={40} key={i} />
                )
            }
        }
        return returnVals;
    }, [maxLenght, pin.length, theme.colors.primary])

    useEffect(() => {
        if (pin.length === maxLenght) {
            handleUnlock()
        }
    }, [pin])

    const addToPin = (value: string) => {
        if (pin.length < maxLenght) {
            setPin(pin + value);
        }
    }

    const removeLastLetter = () => {
        if (pin.length > 0) {
            setPin(pin.slice(0, -1));
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text>{t('Enter PIN')}:</Text>
            <Text
                style={{
                    marginVertical: 5
                }}
            >
                {maskedPin}
            </Text>
            <View style={styles.numberPadWrap}>
                <TouchableOpacity style={[styles.numberPadButton, { backgroundColor: theme.colors.primaryContainer }]} onPress={() => addToPin('1')}>
                    <Text>1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numberPadButton, { backgroundColor: theme.colors.primaryContainer }]} onPress={() => addToPin('2')}>
                    <Text>2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numberPadButton, { backgroundColor: theme.colors.primaryContainer }]} onPress={() => addToPin('3')}>
                    <Text>3</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numberPadButton, { backgroundColor: theme.colors.primaryContainer }]} onPress={() => addToPin('4')}>
                    <Text>4</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numberPadButton, { backgroundColor: theme.colors.primaryContainer }]} onPress={() => addToPin('5')}>
                    <Text>5</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numberPadButton, { backgroundColor: theme.colors.primaryContainer }]} onPress={() => addToPin('6')}>
                    <Text>6</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numberPadButton, { backgroundColor: theme.colors.primaryContainer }]} onPress={() => addToPin('7')}>
                    <Text>7</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numberPadButton, { backgroundColor: theme.colors.primaryContainer }]} onPress={() => addToPin('8')}>
                    <Text>8</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numberPadButton, { backgroundColor: theme.colors.primaryContainer }]} onPress={() => addToPin('9')}>
                    <Text>9</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numberPadButton, { backgroundColor: theme.colors.primaryContainer }]} onPress={removeLastLetter}>
                    <Icon source="backspace" size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numberPadButton, { backgroundColor: theme.colors.primaryContainer }]} onPress={() => addToPin('0')}>
                    <Text>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numberPadButton, { backgroundColor: theme.colors.primaryContainer }]} onPress={handleUnlock}>
                    <Icon source="check" size={24} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        borderWidth: 1,
        width: 100,
        textAlign: 'center',
        marginVertical: 10
    },
    numberPadWrap: {
        width: 162,
        height: 216,
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    numberPadButton: {
        width: 50,
        height: 50,
        margin: 2,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#c2c2c2",
        borderRadius: 5,
    }
});

export default LockScreen
