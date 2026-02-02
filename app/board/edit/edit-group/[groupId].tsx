import GroupEdit from "@/components/GroupEdit";
import useTranslation from "@/localization";
import STORAGE from "@/storage";
import { FinalGroup, Item } from "@/types";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native"

const EditGroup = () => {
    const { groupId } = useLocalSearchParams();
    const navigation = useNavigation()
    const t = useTranslation()

    const [group, setGroup] = useState<FinalGroup | null>(null)

    const getListItems = async (ids: number[]): Promise<Item[]> => {
        try {
            // const listsPromises = ids.map(async (itemIds) => {
            //     if (itemIds) {
            //         const lists = await STORAGE.getItemsByIds(itemIds);
            //         return lists || [];
            //     }
            //     return [];
            // });

            const listsFinal = await STORAGE.getItemsByIds(ids);
            return listsFinal;
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error;
        }
    };

    const getGroup = () => {
        console.log('Getting group...')
        STORAGE.getGroup(Number(groupId)).then(result => {
            if (result) {
                getListItems(result.lists).then(items => {
                    console.log('List items fetched:', items);
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
        navigation.setOptions({ title: t('Edit group') });
        getGroup()
    }, [groupId, navigation])

    if (!group) return null

    return (
        <View style={style.wrap}>
            <GroupEdit
                name={group.name}
                id={group.id}
                color={group.color}
                key={group.id}
                onRefresh={getGroup}
                lists={group.lists}
                listsMap={group.listsMap}
            />
        </View>
    )
}

const style = StyleSheet.create({
    wrap: {
        padding: 10,
        height: '100%'
    }
})

export default EditGroup
