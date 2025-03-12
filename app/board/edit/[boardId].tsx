import useTranslation from "@/localization";
import useLock from "@/lock";
import STORAGE from "@/storage";
import { Board } from "@/types";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, View, StyleSheet, TouchableOpacity, RefreshControl } from "react-native"
import { useTheme, Text, Icon, Button, Portal, IconButton, Menu, Divider, Dialog } from "react-native-paper";
import EditGroup from "@/components/EditGroup";
import EditGroupName from "@/components/EditGroupName";
import EditGroupColor from "@/components/EditGroupColor";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setEditingGroup } from "@/store/slices/global";

const EditBoard = () => {
    const { unlocked, LockScreen } = useLock();
    const { boardId } = useLocalSearchParams();
    const navigation = useNavigation();
    const t = useTranslation()
    const theme = useTheme()
    const { editingGroup } = useSelector((state: RootState) => state.global)
    const dispatch = useDispatch()

    const [board, setBoard] = useState<Board | null>(null);
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [editName, setEditName] = useState<string | null>(null)
    const [editColor, setEditColor] = useState<string | null>(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

    const refreshBoard = useCallback(() => {
        setRefreshing(true)
        STORAGE.getBoardById(Number(boardId)).then(result => {
            if (result) {
                setBoard(result);
                setRefreshing(false)
            }
        })
    }, [boardId])

    const addGroup = useCallback(() => {
        STORAGE.addGroup(Number(boardId), t('New group')).then(() => {
            refreshBoard()
        })
    }, [boardId, refreshBoard, t])

    const editGroup = useCallback((id: number) => {
        dispatch(setEditingGroup(id))
    }, [dispatch])

    const handleDeleteGroup = useCallback(() => {
        if (editingGroup) {
            STORAGE.deleteGroupById(editingGroup).then(() => {
                setShowDeleteDialog(false)
                dispatch(setEditingGroup(null))
                refreshBoard()
            })
        }
    }, [dispatch, editingGroup, refreshBoard])

    useEffect(() => {
        navigation.setOptions({
            title: t('Edit board'),
            headerRight: () => (
                <View
                    style={{
                        flexDirection: 'row',
                        gap: 10
                    }}
                >
                    <Button
                        mode="text"
                        icon="plus"
                        onPress={addGroup}
                    >
                        {t('Add group')}
                    </Button>
                    <Button
                        mode="text"
                        icon="trash-can-outline"
                        onPress={() => setShowDeleteDialog(true)}
                        textColor={theme.colors.error}
                        disabled={!editingGroup}
                    >
                        {t('Delete group')}
                    </Button>
                    <Button
                        mode="text"
                        icon="pencil"
                        disabled={!editingGroup}
                        onPress={() => {
                            const currentName = board?.groups?.find(({ id }) => id === editingGroup)?.name
                            console.log(currentName)
                            setEditName(currentName ?? null)
                        }}
                    >
                        {t('Edit name')}
                    </Button>
                    <Button
                        mode="text"
                        icon="palette"
                        disabled={!editingGroup}
                        onPress={() => {
                            const currentColor = board?.groups?.find(({ id }) => id === editingGroup)?.color
                            console.log(currentColor)
                            setEditColor(currentColor ?? null)
                        }}
                    >
                        {t('Edit color')}
                    </Button>
                </View>
            ),
        });
    }, [addGroup, board?.groups, editingGroup, navigation, t, theme.colors.error])

    useEffect(() => {
        refreshBoard()
    }, [boardId, navigation, refreshBoard])

    useEffect(() => {
        console.log({ editingGroup })
    }, [editingGroup])


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refreshBoard()
        });

        return unsubscribe;
    }, [navigation, refreshBoard]);

    const tabTitles = useMemo<React.ReactNode[]>(() => {
        if (board && board.groups) {
            return board.groups.map(group => (
                <TouchableOpacity
                    onPress={() => editGroup(group.id)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 20,
                        paddingVertical: 10,
                        paddingLeft: 40,
                        paddingRight: 20,
                        backgroundColor: editingGroup === group.id ? theme.colors.elevation.level3 : 'transparent'
                    }}
                    key={group.id}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10
                        }}
                    >
                        <Icon source="format-list-group" size={24} color={group.color} />
                        <Text numberOfLines={1}>{group.name}</Text>
                    </View>
                    <Icon source="chevron-right" size={24} />
                </TouchableOpacity>
            ))
        }
        return [];
    }, [board, editGroup, editingGroup, theme.colors.elevation.level3])

    const tabContents = useMemo<React.ReactNode>(() => {
        if (editingGroup) {
            return (
                <View
                    style={{
                        height: '100%'
                    }}
                >
                    <EditGroup />
                </View>
            )
        }
        return (
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text
                    variant="headlineMedium"
                    style={{
                        color: theme.colors.inversePrimary
                    }}
                >{t('Select group from menu')}</Text>
            </View>
        )
    }, [editingGroup, t, theme])

    if (!unlocked) return LockScreen;

    return (
        <View style={[style.wrap, { backgroundColor: theme.colors.background }]}>
            <Portal>
                <EditGroupName
                    id={editingGroup}
                    active={!!editName}
                    currentName={editName}
                    onClose={() => {
                        setEditName(null)
                        refreshBoard()
                    }}
                />
            </Portal>
            <Portal>
                <EditGroupColor
                    id={editingGroup}
                    active={!!editColor}
                    currentColor={editColor}
                    onClose={() => {
                        setEditColor(null)
                        refreshBoard()
                    }}
                />
            </Portal>
            <View style={[style.tabsTitlesWrap, { backgroundColor: theme.colors.elevation.level1 }]}>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={refreshBoard} />
                    }
                >
                    {tabTitles}
                </ScrollView>
            </View>
            <View style={style.tebContentWrap}>
                {tabContents}
            </View>
            <Portal>
                <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
                    <Dialog.Title>{t('Delete group')}</Dialog.Title>
                    <Dialog.Content>
                        <Text>{t('Are you sure you want to delete this group?')}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowDeleteDialog(false)}>{t('Cancel')}</Button>
                        <Button onPress={handleDeleteGroup}>{t('Delete')}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}

const style = StyleSheet.create({
    wrap: {
        width: '100%',
        height: '100%',
        paddingBottom: 65,
        flexDirection: 'row'
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
    tabsTitlesWrap: {
        width: 300,
        height: '100%',
    },
    tebContentWrap: {
        flex: 1,
        height: '100%'
    }
})

export default EditBoard
