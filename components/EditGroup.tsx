import useTranslation from "@/localization";
import STORAGE from "@/storage";
import { RootState } from "@/store";
import { setEditingColumn } from "@/store/slices/global";
import { FinalGroup, Item } from "@/types";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Divider, Icon, IconButton, List, Text, useTheme, Dialog, Portal } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

interface Props {
    id: number
}

const EditGroup: FC<Props> = ({ id }) => {
    const t = useTranslation()
    const theme = useTheme()
    const router = useRouter()
    const navigation = useNavigation()

    const { items } = useSelector((state: RootState) => state.global)
    const dispatch = useDispatch()

    const [group, setGroup] = useState<FinalGroup | null>(null)
    const [lightUp, setLightUp] = useState<number | null>(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [itemToDelete, setItemToDelete] = useState<{ itemId: number, columnIndex: number, itemIndex: number } | null>(null);

    const getListItems = async (ids: number[][]): Promise<Item[][]> => {
        try {
            const listsPromises = ids.map(async (itemIds) => {
                if (itemIds) {
                    const lists = await STORAGE.getItemsByIds(itemIds);
                    return lists || [];
                }
                return [];
            });

            const listsFinal = await Promise.all(listsPromises);
            return listsFinal;
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error;
        }
    };

    const onOrderChange = (idToMove: number, direction: 'up' | 'down') => {
        if (!group) return;

        const listsMap = [...group.listsMap];
        let found = false;

        for (let i = 0; i < listsMap.length; i++) {
            const index = listsMap[i].indexOf(idToMove);
            if (index !== -1) {
                found = true;
                if (direction === 'up') {
                    if (index === 0) {
                        if (i > 0) {
                            listsMap[i].splice(index, 1);
                            listsMap[i - 1].push(idToMove);
                        }
                    } else {
                        const [movedItem] = listsMap[i].splice(index, 1);
                        listsMap[i].splice(index - 1, 0, movedItem);
                    }
                } else if (direction === 'down') {
                    if (index === listsMap[i].length - 1) {
                        if (i < listsMap.length - 1) {
                            listsMap[i].splice(index, 1);
                            listsMap[i + 1].unshift(idToMove);
                        }
                    } else {
                        const [movedItem] = listsMap[i].splice(index, 1);
                        listsMap[i].splice(index + 1, 0, movedItem);
                    }
                }
                break;
            }
        }

        if (found) {
            setLightUp(idToMove)
            setGroup({
                ...group,
                listsMap
            });

            console.log({ listsMap })

            STORAGE.updateGroupById(id, {
                lists: JSON.stringify(listsMap)
            }).then(() => {
                console.log('Group updated successfully');
            }).catch(error => {
                console.error('Error updating group:', error);
            });
        }
    }

    const getGroupItems = () => {
        STORAGE.getGroup(Number(id)).then(result => {
            if (result) {
                getListItems(result.lists).then(items => {
                    const returnValues = {
                        ...result,
                        lists: items,
                        listsMap: result?.lists,
                    } as FinalGroup

                    setGroup(returnValues)
                }).catch(error => {
                    console.error('Error fetching list items:', error);
                });
            }
        }).catch(error => {
            console.error('Error fetching group:', error);
        });
    }

    useEffect(() => {
        getGroupItems();
    }, [id])

    useEffect(() => {
        console.log({ group })
    }, [group])

    useEffect(() => {
        if (lightUp) {
            setTimeout(() => {
                setLightUp(null)
            }, 200)
        }
    }, [lightUp])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getGroupItems()
        });

        return unsubscribe;
    }, [navigation]);

    const handleDeleteItem = async () => {
        if (!itemToDelete) return;

        const { itemId, columnIndex, itemIndex } = itemToDelete;

        try {
            await STORAGE.deleteItemById(itemId);

            const updatedListsMap = [...group!.listsMap];
            updatedListsMap[columnIndex].splice(itemIndex, 1);

            setGroup({
                ...group!,
                listsMap: updatedListsMap
            });

            await STORAGE.updateGroupById(id, {
                lists: JSON.stringify(updatedListsMap)
            });

            console.log('Item deleted and group updated successfully');
        } catch (error) {
            console.error('Error deleting item:', error);
        } finally {
            setShowDeleteDialog(false);
            setItemToDelete(null);
        }
    };

    const lists = useMemo<React.ReactNode[]>(() => {
        if (!group) return [];
        return group.listsMap.map((column, index) => {
            const itemsRow = column.map((item, itemindex) => (
                <List.Item
                    title={() => (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 10
                            }}
                        >
                            <Icon
                                source={items[item].image ? 'image-outline' : 'image-off-outline'}
                                size={15}
                            />
                            <Text>{items[item].name}</Text>
                        </View>
                    )}
                    key={items[item].id}
                    style={{
                        backgroundColor: lightUp === item ? theme.colors.secondary : 'transparent',
                    }}
                    right={() => (
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 5
                            }}
                        >
                            <IconButton
                                icon="chevron-up"
                                onPress={() => {
                                    onOrderChange(item, 'up')
                                }}
                                disabled={index === 0 && itemindex === 0}
                            />
                            <IconButton
                                icon="chevron-down"
                                onPress={() => {
                                    onOrderChange(item, 'down')
                                }}
                                disabled={index === group.listsMap.length - 1 && itemindex === column.length - 1}
                            />
                            <IconButton
                                icon="trash-can-outline"
                                iconColor={theme.colors.error}
                                onPress={() => {
                                    setItemToDelete({ itemId: item, columnIndex: index, itemIndex: itemindex });
                                    setShowDeleteDialog(true);
                                }}
                            />
                            <IconButton
                                icon="pencil"
                                onPress={() => {
                                    router.navigate(`/board/edit/edit-item/${item}`)
                                }}
                            />
                        </View>
                    )}
                />
            ))
            return (
                <List.Accordion
                    title={`#${index} ${t('Column')}: ${column.length}`}
                    key={`col-${index}`}
                >
                    {itemsRow}
                    <List.Item
                        title={() => (
                            <Button
                                mode="outlined"
                                onPress={() => {
                                    dispatch(setEditingColumn(index))
                                    router.navigate('/board/edit/edit-item/0')
                                }}
                            >
                                {t('Add card')}
                            </Button>
                        )}
                    />
                    <Divider />
                </List.Accordion>
            )
        });
    }, [group, t, lightUp, items])

    return (
        <ScrollView
            style={{
                height: '100%'
            }}
        >
            {lists}
            <Portal>
                <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
                    <Dialog.Title>{t('Delete item')}</Dialog.Title>
                    <Dialog.Content>
                        <Text>{t('Are you sure you want to delete this item?')}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowDeleteDialog(false)}>{t('Cancel')}</Button>
                        <Button onPress={handleDeleteItem}>{t('Delete')}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </ScrollView>
    )
}

export default EditGroup
