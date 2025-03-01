import useTranslation from "@/localization";
import STORAGE from "@/storage";
import { RootState } from "@/store";
import { FinalGroup, Item } from "@/types";
import { useRouter } from "expo-router";
import { FC, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Divider, Icon, IconButton, List, Text, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

interface Props {
    id: number
}

const EditGroup: FC<Props> = ({ id }) => {
    const t = useTranslation()
    const theme = useTheme()
    const router = useRouter()

    const { items } = useSelector((state: RootState) => state.global)

    const [group, setGroup] = useState<FinalGroup | null>(null)
    const [lightUp, setLightUp] = useState<number | null>(null)


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

        // const newLists = [...group?.listsMap]
        // newLists[index] = data;

        // STORAGE.updateGroupById(id, {
        //     lists: JSON.stringify(newLists)
        // }).then(() => {

        // })
    }

    useEffect(() => {
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

    const lists = useMemo<React.ReactNode[]>(() => {
        if (!group) return [];
        return group.listsMap.map((column, index) => {
            const itemsRow = column.map((item, itemindex) => (
                <List.Item
                    title={items[item].name}
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
                                onPress={() => { }}
                            >
                                {t('Add card')}
                            </Button>
                        )}
                    />
                    <Divider />
                </List.Accordion>
            )
        });
    }, [group, t, lightUp])

    return (
        <ScrollView
            style={{
                height: '100%'
            }}
        >
            {lists}
        </ScrollView>
    )
}

export default EditGroup
