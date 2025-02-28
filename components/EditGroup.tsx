import useTranslation from "@/localization";
import STORAGE from "@/storage";
import { FinalGroup, Item } from "@/types";
import { FC, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Divider, Icon, List, Text } from "react-native-paper";

interface Props {
    id: number
}

const EditGroup: FC<Props> = ({ id }) => {
    const t = useTranslation()

    const [group, setGroup] = useState<FinalGroup | null>(null)


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

    const lists = useMemo<React.ReactNode[]>(() => {
        if (!group) return [];
        return group.lists.map((column, index) => {
            const items = column.map((item) => (
                <List.Item title={item.name} key={item.id} />
            ))
            return (
                <List.Accordion
                    title={`#${index} ${t('Column')}: ${column.length}`}
                    key={`col-${index}`}
                >
                    {items}
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
    }, [group, t])

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
