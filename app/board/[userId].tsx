import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import GroupSelector from "@/components/GroupSelector";
import {Dimensions} from 'react-native';
import STORAGE from "@/storage";
import { Group } from "@/types";

const windowHeight = Dimensions.get('window').height;

const Board = () => {
    const { userId } = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter()

    const [groups, setGroups] = useState<Group[]>([])
    const [activeGroupId, setActiveGroupId] = useState<number | null>(null)
    const [boardId, serBoardId] = useState<number | null>(null)

    const activeGroup = useMemo(() => {
        return groups.find(({ id }) => id === activeGroupId) || null
    }, [activeGroupId])

    const bacgroundColor = useMemo(() => {
        const g = groups.find(({ id }) => id === activeGroupId)
        return g?.color || 'red'
    }, [activeGroup]);

    const refreshBoard = async () => {
        setActiveGroupId(null)
        STORAGE.getBoard(Number(userId)).then((board) => {
            if (board) {
                serBoardId(board.id)
                if (board.groups) {
                    setGroups(board.groups)
                    setActiveGroupId(board.groups[0].id)
                }
            }
        })
    }

    useEffect(() => {
        refreshBoard()
    }, [])

    useEffect(() => {
        navigation.setOptions({ header: () => null });
    }, [userId])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refreshBoard()
        });
    
        return unsubscribe;
    }, [navigation]);

    const goBack = () => {
        router.back();
    }

    const goToEditMode = () => {
        router.navigate(`/board/edit/${boardId}`);
    }
    
    return (
        <View>
            <View style={[style.head, { backgroundColor: bacgroundColor }]}>
                <TouchableOpacity onPress={goBack} style={style.headBtn}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={style.headBtn} onPress={goToEditMode}>
                    <MaterialCommunityIcons name="pencil-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={style.boardWrap}>
                <View style={[style.board, { backgroundColor: bacgroundColor }]}>

                </View>
                <View style={style.groups}>
                    {groups.map(
                        (group, index) => (
                            <GroupSelector
                                title={group.name}
                                color={group.color}
                                key={index}
                                onPress={() => setActiveGroupId(group.id)}
                                active={group.id === activeGroupId}
                            />
                        )
                    )}
                </View>
                <View style={style.readLine}>

                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    head: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 50,
    },
    headBtn: {
        padding: 10,
    },
    boardWrap: {

    },
    groups: {
        height: 40,
        flexDirection: "row",
        backgroundColor: "grey",
        gap: 5,
    },
    board: {
        height: windowHeight - 150 - 50
    },
    readLine: {
        height: 145,
        backgroundColor: "grey"
    }
})

export default Board
