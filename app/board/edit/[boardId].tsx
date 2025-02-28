import GroupEdit from "@/components/GroupEdit";
import useTranslation from "@/localization";
import useLock from "@/lock";
import STORAGE from "@/storage";
import { Board } from "@/types";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View, StyleSheet, TouchableOpacity, RefreshControl } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useTheme, Text, Icon, Button, Divider, Portal } from "react-native-paper";
import EditGroup from "@/components/EditGroup";
import EditGroupName from "@/components/EditGroupName";

const EditBoard = () => {
    const { unlocked, LockScreen } = useLock();
    const { boardId } = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter()
    const t = useTranslation()
    const theme = useTheme()

    const [board, setBoard] = useState<Board | null>(null);
    const [editingGroup, setEditingGroup] = useState<number | null>(null)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [editName, setEditName] = useState<string | null>(null)

    const refreshBoard = () => {
        setRefreshing(true)
        STORAGE.getBoardById(Number(boardId)).then(result => {
            if (result) {
                setBoard(result);
                setRefreshing(false)
            }
        })
    }

    const editGroup = (id: number) => {
        // router.navigate(`/board/edit/edit-group/${id}`)
        setEditingGroup(id)
    }

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
                        mode="contained"
                        icon="plus"
                        onPress={addGroup}
                    >
                        {t('Add group')}
                    </Button>
                    <Button
                        mode="contained"
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
                        mode="contained"
                        icon="palette"
                        disabled={!editingGroup}
                    >
                        {t('Edit color')}
                    </Button>
                </View>

            ),
        });
    }, [board?.groups, editingGroup, navigation, t])

    useEffect(() => {
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
                    style={[style.groupWrap, { backgroundColor: group.color }]}
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

    useEffect(() => {
        if (board?.groups && board.groups.length > 0) {
            setEditingGroup(board.groups[0].id ?? null);
        } else {
            setEditingGroup(null);
        }
    }, [board])

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
    }, [board, editingGroup, theme.colors.elevation.level3])

    const tabContents = useMemo<React.ReactNode>(() => {
        if (editingGroup) {
            return (
                <View
                    style={{
                        height: '100%'
                    }}
                >
                    <EditGroup id={editingGroup} />
                </View>
            )
        }
        return null
    }, [editingGroup])

    if (!unlocked) return LockScreen;

    return (
        // <View style={style.wrap}>
        //     <ScrollView
        //         style={{width: '100%'}}
        //         refreshControl={
        //             <RefreshControl refreshing={refreshing} onRefresh={refreshBoard} />
        //         }
        //     >
        //         <View style={{ alignItems: "center" }}>
        //             <View style={style.innerWrap}>
        //                 {renderGroups}
        //                 <TouchableOpacity style={style.addGroup} onPress={addGroup}>
        //                     <AntDesign name="plus" size={24} color="grey" />
        //                 </TouchableOpacity>
        //             </View>
        //         </View>
        //     </ScrollView>
        // </View>

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
    // groupWrap: {
    //     borderWidth: 1,
    //     borderRadius: 5,
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    //     alignItems: "center",
    //     padding: 10,
    //     marginBottom: 10,
    //     height: 50
    // },
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
