import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as SecureStore from 'expo-secure-store';
import { DEFAULT_STARTER_BOARD } from "@/constants/global";
import GroupSelector from "@/components/GroupSelector";

const Board = () => {

    const { userId } = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter()

    const [board, setBoard] = useState<any>(null);

    useEffect(() => {
        navigation.setOptions({ header: () => null });
    }, [userId])

    useEffect(() => {
        const boardFromStore = JSON.parse(SecureStore.getItem(`board-${userId}`))
        setBoard( boardFromStore || DEFAULT_STARTER_BOARD)
    }, [])

    useEffect(() => {
        SecureStore.setItem(`board-${userId}`, JSON.stringify(board))
        console.log(board);
    }, [board]);

    const goBack = () => {
        router.back();
    }

    if (!board) return null;
    
    return (
        <View>
            <View style={style.head}>
                <TouchableOpacity onPress={goBack} style={style.headBtn}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={style.headBtn}>
                    <MaterialCommunityIcons name="pencil-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={style.boardWrap}>
                <View>

                </View>
                <View style={style.groups}>
                    {board.groups.map(
                        group => <GroupSelector title={group.title} color={group.color} />
                    )}
                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    head: {
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    headBtn: {
        padding: 10,
    },
    boardWrap: {

    },
    groups: {

    }
})

export default Board
