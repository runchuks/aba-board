import GroupEdit from "@/components/GroupEdit";
import useTranslation from "@/localization";
import useLock from "@/lock";
import STORAGE from "@/storage";
import { Board } from "@/types";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, RefreshControl } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';

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

    useEffect(() => {
        navigation.setOptions({ title: t('Edit board') });
        refreshBoard()
    }, [boardId, navigation])

    useEffect(() => {
        console.log({ editingGroup })
    }, [editingGroup])

    const renderGroups = useMemo<React.ReactNode[]>(() => {
        if (board && board.groups) {
            return board.groups.map(group => (
                <GroupEdit
                    name={group.name}
                    id={group.id}
                    color={group.color}
                    onEdit={setEditingGroup}
                    editMode={group.id === editingGroup}
                    key={group.id}
                    onRefresh={refreshBoard}
                    lists={group.lists}
                />
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
        width: '100%',
        marginBottom: 50,
        padding: 15
    },
    addGroup: {
        borderWidth: 2,
        borderColor: 'grey',
        alignItems: "center",
        paddingVertical: 5
    }
})

export default EditBoard
