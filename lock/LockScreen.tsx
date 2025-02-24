import useTranslation from "@/localization";
import { View, StyleSheet, Text, TextInput, Button, TouchableOpacity } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import { useEffect, useMemo } from "react";

interface Props {
    setPin: (value: string) => void,
    handleUnlock: () => void,
    pin: string,
    maxLenght: number
}

const LockScreen: React.FC<Props> = ({ setPin, handleUnlock, pin, maxLenght }) => {
    const t = useTranslation()

    const maskedPin = useMemo(() => {
        const returnVals = [];
        for (let i = 0; i < pin.length; i++) {
            returnVals.push(
                <Entypo name="dot-single" size={40} color="black" key={i} />
            )
        }
        if (returnVals.length < maxLenght) {
            for (let i = returnVals.length; i < maxLenght; i++) {
                returnVals.push(
                    <Entypo name="dot-single" size={40} color="#d6d6d6" key={i} />
                )
            }
        }
        return returnVals;
    }, [pin])

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
        <View style={styles.container}>
            <Text>{t('Enter PIN')}:</Text>
            <Text
                style={{
                    marginVertical: 5
                }}
            >
                {maskedPin}
            </Text>
            <View style={styles.numberPadWrap}>
                <TouchableOpacity style={styles.numberPadButton} onPress={() => addToPin('1')}>
                    <Text>1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.numberPadButton} onPress={() => addToPin('2')}>
                    <Text>2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.numberPadButton} onPress={() => addToPin('3')}>
                    <Text>3</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.numberPadButton} onPress={() => addToPin('4')}>
                    <Text>4</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.numberPadButton} onPress={() => addToPin('5')}>
                    <Text>5</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.numberPadButton} onPress={() => addToPin('6')}>
                    <Text>6</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.numberPadButton} onPress={() => addToPin('7')}>
                    <Text>7</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.numberPadButton} onPress={() => addToPin('8')}>
                    <Text>8</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.numberPadButton} onPress={() => addToPin('9')}>
                    <Text>9</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.numberPadButton} onPress={removeLastLetter}>
                    <Ionicons name="backspace" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.numberPadButton} onPress={() => addToPin('0')}>
                    <Text>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.numberPadButton} onPress={handleUnlock}>
                    <Feather name="check" size={24} color="black" />
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
