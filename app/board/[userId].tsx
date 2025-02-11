import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useReducer, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as SecureStore from 'expo-secure-store';
import { DEFAULT_STARTER_BOARD } from "@/constants/global";
import GroupSelector from "@/components/GroupSelector";
import {Dimensions} from 'react-native';
import STORAGE from "@/storage";

const windowHeight = Dimensions.get('window').height;

const activeGroupReducer = (state, action) => {
    switch (action.type) {
        case 'set-color':
            return {
                ...state,
                color: action.payload,
            }
        case 'set-title':
            return {
                ...state,
                title: action.payload
            }
        case 'set-group':
            return {
                ...state,
                title: action.payload.title,
                color: action.payload.color
            }
        default:
            return state
    }
}

const Board = () => {

    const { userId } = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter()

    const [board, setBoard] = useState<any>(null);
    // const [activeGroup, dispatch] = useReducer(activeGroupReducer,{})

    const [groups, setGroups] = useState([])
    const [activeGroup, setActiveGroup] = useState([])

    const bacgroundColor = useMemo(() => {
        const g = groups.find(({ id }) => id === activeGroup)
        return g?.color || 'red'
    }, [activeGroup]);

    const refreshBoard = async () => {
        STORAGE.getBoard(userId).then((board) => {
            // console.log({ board, groups: board.groups })
            setGroups(board.groups)
            setActiveGroup(board.groups[0].id)
        })
    }


    useEffect(() => {
        refreshBoard()
    }, [])

    useEffect(() => {
        navigation.setOptions({ header: () => null });
    }, [userId])

    const goBack = () => {
        router.back();
    }
    
    return (
        <View>
            <View style={[style.head, { backgroundColor: bacgroundColor }]}>
                <TouchableOpacity onPress={goBack} style={style.headBtn}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={style.headBtn}>
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
                                onPress={() => setActiveGroup(group.id)}
                                active={group.id === activeGroup}
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
        backgroundColor: "grey"
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
