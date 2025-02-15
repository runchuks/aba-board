import GroupEdit from "@/components/GroupEdit";
import useTranslation from "@/localization";
import useLock from "@/lock";
import STORAGE from "@/storage";
import { Board } from "@/types";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, RefreshControl } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

const EditBoard = () => {
    const { unlocked, LockScreen } = useLock();
    const { boardId } = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter()
    const t = useTranslation()

    const [board, setBoard] = useState<Board | null>(null);
    const [editingGroup, setEditingGroup] = useState<number | null>(null)
    const [refreshing, setRefreshing] = useState<boolean>(false)

    const refreshBoard = () => {
        setRefreshing(true)
        STORAGE.getBoardById(Number(boardId)).then(result => {
            if (result) {
                console.log({ result })
                navigation.setOptions({ title: `${t('Edit board')}: ${result.id}` });
                setBoard(result);
                setRefreshing(false)
            }
        })
    }

    const editGroup = (id: number) => {
        router.navigate(`/board/edit/edit-group/${id}`)
    }

    useEffect(() => {
        navigation.setOptions({ title: t('Edit board') });
        refreshBoard()
    }, [boardId, navigation])

    useEffect(() => {
        console.log({ editingGroup })
    }, [editingGroup])


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refreshBoard()
        });

        return unsubscribe;
    }, [navigation]);

    const renderGroups = useMemo<React.ReactNode[]>(() => {
        if (board && board.groups) {
            return board.groups.map(group => (
                <TouchableOpacity
                    onPress={() => editGroup(group.id)}
                    style={[style.groupWrap, { backgroundColor: group.color}]}
                    key={group.id}
                >
                    <Text numberOfLines={1}>{group.name}</Text>
                    <Entypo name="chevron-thin-right" size={24} color="black" />
                </TouchableOpacity>
            ))
        }
        return []
    }, [JSON.stringify(board), editingGroup]);

    const addGroup = () => {
        STORAGE.addGroup(Number(boardId), t('New group')).then(() => {
            refreshBoard()
        })
    }

    if (!unlocked) return LockScreen;

    return (
        <View style={style.wrap}>
            <ScrollView
                style={{width: '100%'}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={refreshBoard} />
                }
            >
                <View style={{ alignItems: "center" }}>
                    <View style={style.innerWrap}>
                        {renderGroups}
                        <TouchableOpacity style={style.addGroup} onPress={addGroup}>
                            <AntDesign name="plus" size={24} color="grey" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const style = StyleSheet.create({
    wrap: {
        alignItems: "center",
        width: '100%',
    },
    innerWrap: {
        width: 400,
        marginBottom: 50,
        padding: 15
    },
    addGroup: {
        borderWidth: 2,
        borderColor: 'grey',
        alignItems: "center",
        paddingVertical: 5
    },
    groupWrap: {
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        marginBottom: 10,
        height: 50
    },
})

export default EditBoard
