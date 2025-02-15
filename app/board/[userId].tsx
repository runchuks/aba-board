import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutRectangle, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import GroupSelector from "@/components/GroupSelector";
import {Dimensions} from 'react-native';
import STORAGE from "@/storage";
import { Group } from "@/types";
import CardColumn from "@/components/CardColumn";
import Feather from '@expo/vector-icons/Feather';
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "@/store/slices/global";
import speak from "@/speak";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Board = () => {
    const { userId } = useLocalSearchParams()
    const navigation = useNavigation()
    const router = useRouter()
    const dispatch = useDispatch()
    const { items, lang } = useSelector(state => state.global)

    const [groups, setGroups] = useState<Group[]>([])
    const [activeGroupId, setActiveGroupId] = useState<number | null>(null)
    const [boardId, serBoardId] = useState<number | null>(null)

    const [currentText, setCurrentText] = useState<string>('');

    const [insideIds, setInsiteIds] = useState<number[]>([])

    const dropZoneRef = useRef<View>(null);
    const [layout, setLayout] = useState<LayoutRectangle | null>(null);

    const insideCards = useRef<Record<number, number | null>>({});


    const activeGroup = useMemo(() => {
        console.log({ activeGroupId })
        return groups.find(({ id }) => id === activeGroupId) || null
    }, [activeGroupId])

    const bacgroundColor = useMemo(() => {
        const g = groups.find(({ id }) => id === activeGroupId)
        return g?.color || 'transparent'
    }, [activeGroupId]);

    const refreshBoard = async () => {
        console.log('refreshing board')
        setActiveGroupId(null)
        setGroups([])
        setCurrentText('')
        setInsiteIds([])
        serBoardId(null)
        insideCards.current = {}
        STORAGE.getBoard(Number(userId)).then((board) => {
            if (board) {
                serBoardId(board.id)
                if (board.groups) {
                    setGroups(board.groups)
                    setActiveGroupId(board.groups[0].id)
                }
            }
            STORAGE.getAllItemsAsRecord().then(allItems => {
                dispatch(setItems(allItems))
            })
        })
    }

    useEffect(() => {
        refreshBoard()
    }, [])

    useEffect(() => {
        navigation.setOptions({ header: () => null });
    }, [userId])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refreshBoard()
        });
    
        return unsubscribe;
    }, [navigation]);

    const goBack = () => {
        router.back();
    }

    const goToEditMode = () => {
        router.navigate(`/board/edit/${boardId}`);
    }

    useEffect(() => {
        dropZoneRef.current?.measure((x, y, width, height, pageX, pageY) => {
            setLayout({ x: pageX, y: pageY, width, height });
        });
    }, []);
    
    const handleDrag = (id: number, x: number, y: number) => {
        if (layout) {
            if (x >= layout.x && x <= layout.x + layout.width && y >= layout.y && y <= layout.y + layout.height) {
                insideCards.current[id] = x
            } else {
                insideCards.current[id] = null
            }
        }
    };

    const onDrop = (id: number) => {
        console.log('dropped', id)
        const sorted =  Object.entries(insideCards.current)
            .filter(([, value]) => value !== null) // Exclude null values
            .sort(([, a], [, b]) => a - b)         // Sort by value
            .map(([key]) => Number(key));
            setInsiteIds(sorted)
    }

    const repeatSpeak = () => {
        if (currentText) {
            speak(currentText, lang)
        }
    }

    useEffect(() => {
        console.log('inside ids', JSON.stringify(insideIds));
        let text = ''
        insideIds.forEach((itemId, index) => {
            text = text + `${items[itemId].name}`
            if (index + 1 === insideIds.length) {
                text = text + '.'
            } else {
                text = text + ' '
            }
        });
        console.log(text)
        setCurrentText(text)
    }, [insideIds])

    useEffect(() => {
        if (currentText) {
            speak(currentText, lang)
        }
    }, [currentText, lang])
    
    const renderGroupItems = useMemo<React.ReactNode[]>(() => {
        // const sg = groups.find(g => g.id === activeGroupId)
        return groups.map(g => {
            const colons = g.lists.map(ids => (
                <CardColumn
                    ids={ids}
                    onDrag={handleDrag}
                    onDrop={onDrop}
                    display={activeGroupId === g.id}
                    activeCards={insideIds}
                />
                // <Text>{JSON.stringify(ids)}</Text>
            ))
            return (
                <View style={{ 
                    position: "absolute", 
                    height: windowHeight - 150 - 50, 
                    width: windowWidth,
                    flexDirection: "row",
                    borderWidth: 1,
                    borderColor: 'red'
                }}>
                    {colons}
                </View>
            )
        })
        // if (sg) {
        //     console.log({ sg })
        //     return sg.lists.map(ids => (
        //         <CardColumn ids={ids} onDrag={handleDrag} onDrop={onDrop} />
        //         // <Text>{JSON.stringify(ids)}</Text>
        //     ))
        // }
        
        return []
    }, [userId, activeGroupId, insideIds.length]);
    
    return (
        <View>
            <View style={[style.head, { backgroundColor: bacgroundColor }]}>
                <TouchableOpacity onPress={goBack} style={style.headBtn}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                <Text>{activeGroup?.name}</Text>
                <TouchableOpacity style={style.headBtn} onPress={goToEditMode}>
                    <MaterialCommunityIcons name="pencil-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={style.boardWrap}>
                <View style={[style.board, { backgroundColor: bacgroundColor }]}>
                    {renderGroupItems}
                </View>
                <View>
                    <ScrollView horizontal style={style.groups}>
                        {groups.map(
                            (group, index) => (
                                <GroupSelector
                                    title={group.name}
                                    color={group.color}
                                    key={index}
                                    onPress={() => setActiveGroupId(group.id)}
                                    active={group.id === activeGroupId}
                                />
                            )
                        )}
                    </ScrollView>
                    
                </View>
                <View style={style.readLine} ref={dropZoneRef}>
                    <View style={style.readLineControls}>
                        <TouchableOpacity onPress={repeatSpeak}>
                            <Feather name="volume-2" size={30} color="black" />
                        </TouchableOpacity>
                    </View>
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
        backgroundColor: "grey",
        gap: 5,
    },
    board: {
        height: windowHeight - 150 - 50,
        flexDirection: "row",
        marginRight: -200
    },
    readLine: {
        height: 145,
        backgroundColor: "grey",
        borderWidth: 1,
        borderColor: 'blue',
        position: "relative"
    },
    readLineControls: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 50,
        borderWidth: 1,
        height: 145,
        alignItems: "center",
        justifyContent: "center"
    }
})

export default Board
