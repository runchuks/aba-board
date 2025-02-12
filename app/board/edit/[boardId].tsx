import GroupEdit from "@/components/GroupEdit";
import useTranslation from "@/localization";
import useLock from "@/lock";
import STORAGE from "@/storage";
import { Board } from "@/types";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native"

const EditBoard = () => {
    const { unlocked, LockScreen } = useLock();
    const { boardId } = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter()
    const t = useTranslation()

    const [board, setBoard] = useState<Board | null>(null);
    const [editingGroup, setEditingGroup] = useState<number | null>(null)

    useEffect(() => {
        navigation.setOptions({ title: t('Edit board') });
        STORAGE.getBoardById(Number(boardId)).then(result => {
            if (result) {
                console.log({ result })
                navigation.setOptions({ title: `${t('Edit board')}: ${result.id}` });
                setBoard(result);
            }
        })
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
                />
            ))
        }
        return []
    }, [JSON.stringify(board), editingGroup]);

    if (!unlocked) return LockScreen;

    return (
        <View style={style.wrap}>
            <ScrollView style={{width: '100%'}}>
                <View style={{ alignItems: "center" }}>
                    <View style={style.innerWrap}>
                        {renderGroups}
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
        width: 600,
        marginBottom: 50,
        paddingVertical: 10
    }
})

export default EditBoard
