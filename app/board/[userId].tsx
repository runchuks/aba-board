import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutRectangle, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import GroupSelector from "@/components/GroupSelector";
import { Dimensions } from 'react-native';
import STORAGE from "@/storage";
import { Group } from "@/types";
import CardColumn from "@/components/CardColumn";
import Feather from '@expo/vector-icons/Feather';
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "@/store/slices/global";
import speak from "@/speak";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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

    const [autoSpeak, setAutoSpeak] = useState<boolean>(true)

    const [currentText, setCurrentText] = useState<string>('');

    const [insideIds, setInsiteIds] = useState<number[]>([])

    const dropZoneRef = useRef<View>(null);
    const [layout, setLayout] = useState<LayoutRectangle | null>(null);

    const insideCards = useRef<Record<number, number | null>>({});

    const [cardSize, setCardSize] = useState<number>(0);


    const activeGroup = useMemo(() => {
        return groups.find(({ id }) => id === activeGroupId) || null
    }, [activeGroupId, groups])

    const bacgroundColor = useMemo(() => {
        const g = groups.find(({ id }) => id === activeGroupId)
        return g?.color || 'transparent'
    }, [activeGroupId, groups]);

    const refreshBoard = async () => {
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
        const sorted = Object.entries(insideCards.current)
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
        if (currentText && autoSpeak) {
            speak(currentText, lang)
        }
    }, [autoSpeak, currentText, lang])

    const calculateAreaDifference = (cardSize: number, columnArea: number, maxCardCount: number) => {
        const cardTotalArea = (maxCardCount * 2) * (cardSize * cardSize);
        if (cardTotalArea > columnArea) {
            console.log('cardTotalArea', cardTotalArea)
            console.log('columnArea', columnArea)

            return calculateAreaDifference(cardSize - 1, columnArea, maxCardCount)
        }
        return cardSize;
    }

    useEffect(() => {
        ///list optiomal size calculation
        const columnHeight = windowHeight - 150 - 50;
        const columnWidth = windowWidth / 3;
        const columnArea = columnHeight * columnWidth;

        let maxCardCount = 0;

        groups.forEach(group => {
            group.lists.forEach(list => {
                if (list.length > maxCardCount) {
                    maxCardCount = list.length
                }
            })
        })

        let tempCardSize = 300;

        if (maxCardCount > 0) {
            const calculatedCardSize = calculateAreaDifference(tempCardSize, columnArea, maxCardCount);
            setCardSize(calculatedCardSize)
            console.log('cardSize', calculatedCardSize)
        }

    }, [groups])

    const renderGroupItems = useMemo<React.ReactNode>(() => {
        if (!cardSize) return null;
        return groups.map(g => {
            const colons = g.lists.map((ids, index) => (
                <CardColumn
                    ids={ids}
                    onDrag={handleDrag}
                    onDrop={onDrop}
                    display={activeGroupId === g.id}
                    activeCards={insideIds}
                    key={index}
                    cardSize={cardSize}
                    last={index === g.lists.length - 1}
                />
            ))
            return (
                <View style={{
                    position: "absolute",
                    height: windowHeight - 150 - 50,
                    width: windowWidth,
                    flexDirection: "row",
                }} key={g.id}>
                    {colons}
                </View>
            )
        })
    }, [groups, activeGroupId, insideIds, cardSize]);

    return (
        <View style={{ height: '100%' }}>
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
                        <TouchableOpacity onPress={() => setAutoSpeak(!autoSpeak)} style={{ alignItems: "center" }}>
                            <MaterialIcons name="auto-mode" size={24} color={autoSpeak ? 'blue' : 'black'} />
                            <Text style={{ fontSize: 7 }}>Auto: {autoSpeak ? 'on' : 'off'}</Text>
                        </TouchableOpacity>
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
        flex: 1
    },
    groups: {
        height: 40,
        flexDirection: "row",
        gap: 5,
    },
    board: {
        height: windowHeight - 150 - 50,
        flexDirection: "row",
    },
    readLine: {
        flex: 1,
    },
    readLineControls: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 50,
        height: 145,
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 10
    }
})

export default Board
