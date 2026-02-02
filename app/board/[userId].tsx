import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutRectangle, ScrollView, StyleSheet, Text, View } from "react-native"
import GroupSelector from "@/components/GroupSelector";
import { Dimensions } from 'react-native';
import STORAGE from "@/storage";
import { Group } from "@/types";
import CardColumn from "@/components/CardColumn";
import { useDispatch, useSelector } from "react-redux";
import { setEditingGroup, setItems } from "@/store/slices/global";
import speak from "@/speak";
import { DEFAULT_READ_LINE_HEIGHT, GROUP_HEIGHT, MAX_CARD_SIZE, MIN_CARD_SIZE } from "@/constants/global";
import AntDesign from '@expo/vector-icons/AntDesign';
import useTranslation from "@/localization";
import { RootState } from "@/store";
import { FAB, IconButton, Modal, Portal, ToggleButton, useTheme } from "react-native-paper";
import QuickAdd from "@/components/QuickAdd";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Board = () => {
    const { userId } = useLocalSearchParams()
    const navigation = useNavigation()
    const router = useRouter()
    const t = useTranslation()
    const dispatch = useDispatch()
    const theme = useTheme()
    const { items, lang, voicesLoaded, autoPlayDefaultValue, quickAddEnabled } = useSelector((state: RootState) => state.global)

    const [groups, setGroups] = useState<Group[]>([])
    const [activeGroupId, setActiveGroupId] = useState<number | null>(null)
    const [boardId, serBoardId] = useState<number | null>(null)
    const [autoSpeak, setAutoSpeak] = useState<boolean>(autoPlayDefaultValue)
    const [currentText, setCurrentText] = useState<string>('');
    const [insideIds, setInsiteIds] = useState<number[]>([])
    const [showQuickAddModal, setShowQuickAddModal] = useState<boolean>(false)
    const [dragging, setDragging] = useState<boolean>(false)

    const dropZoneRef = useRef<View>(null);
    const [layout, setLayout] = useState<LayoutRectangle | null>(null);
    const [readLinePosX, setReadLinePosX] = useState<{ min: number, max: number }>({ min: 0, max: 0 });
    const [readLinePosY, setReadLinePosY] = useState<{ min: number, max: number }>({ min: 0, max: 0 });
    const insideCards = useRef<Record<number, number | null>>({});
    const [readLineHeight, setReadLineHeight] = useState(DEFAULT_READ_LINE_HEIGHT)
    const [cardSize, setCardSize] = useState<number>(0);
    const [currentDraggedInside, setCurrentDraggedInside] = useState<number | null>(null)

    const activeGroup = useMemo(() => {
        return groups.find(({ id }) => id === activeGroupId) || null
    }, [activeGroupId, groups])

    const columnHeight = useMemo(() => {
        return windowHeight - GROUP_HEIGHT - readLineHeight - 50;
    }, [readLineHeight])

    const bacgroundColor = useMemo(() => {
        const g = groups.find(({ id }) => id === activeGroupId)
        return g?.color || 'transparent'
    }, [activeGroupId, groups]);

    useEffect(() => {
        if (groups.length > 0) {
            groups.forEach(group => {
                if (group.lists.length > 0) {
                    if (Array.isArray(group.lists[0])) {
                        const newList = [
                            ...group.lists[0],
                            ...group.lists[1],
                            ...group.lists[2],
                        ]
                        STORAGE.updateGroupById(group.id, {
                            lists: JSON.stringify(newList)
                        })
                    } else {
                        console.log('list ok')
                        console.log(group.lists)
                    }
                }
            })
        }
    }, [groups])

    const refreshBoard = async () => {
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
                    if (activeGroupId === null) {
                        setActiveGroupId(board.groups[0].id)
                    }
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
        dispatch(setEditingGroup(activeGroupId))
    }, [activeGroupId])

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
            setReadLinePosX({ min: pageX - cardSize / 2, max: pageX + width + cardSize / 2 });
            setReadLinePosY({ min: pageY - cardSize / 2, max: pageY + height + cardSize / 2 });
        });
    }, [readLineHeight, cardSize]);

    const handleDrag = useCallback((id: number, x: number, y: number) => {
        if (layout) {
            setDragging(true);

            const isInX = x >= readLinePosX.min && x <= readLinePosX.max
            const isInY = y >= readLinePosY.min && y <= readLinePosY.max

            if (isInX && isInY) {
                insideCards.current[id] = x
                setCurrentDraggedInside(id)
            } else {
                insideCards.current[id] = null
                setCurrentDraggedInside(null)
            }
        }
    }, [layout, readLinePosX.max, readLinePosX.min, readLinePosY.max, readLinePosY.min]);

    const onDrop = (id: number) => {
        setDragging(false);
        const sorted = Object.entries(insideCards.current)
            .filter(([, value]) => value !== null) // Exclude null values
            .sort(([, a], [, b]) => a - b)         // Sort by val
            .map(([key]) => Number(key));
        setInsiteIds(sorted)
    }

    const repeatSpeak = () => {
        if (currentText) {
            speak(currentText, lang)
        }
    }

    useEffect(() => {
        let text = ''
        insideIds.forEach((itemId, index) => {
            text = text + `${index === 0 ? items[itemId].name : items[itemId].name.toLowerCase()}`
            if (index + 1 === insideIds.length) {
                text = text + '.'
            } else {
                text = text + ' '
            }
        });
        setCurrentText(text)
    }, [insideIds, items])

    useEffect(() => {
        if (currentText && autoSpeak) {
            speak(currentText, lang)
        }
    }, [autoSpeak, currentText, lang])

    const calculateAreaDifference = useCallback((
        cardSize: number,
        columnWidth: number,
        columnHeight: number,
        maxCardCount: number,
    ) => {
        const maxCountInColumnY = Math.floor(columnHeight / cardSize);
        const maxCountInColumnX = Math.floor(columnWidth / cardSize);
        const maxCountTotal = maxCountInColumnX * maxCountInColumnY;

        if (maxCardCount > maxCountTotal) {

            return calculateAreaDifference(cardSize - 10, columnWidth, columnHeight, maxCardCount)
        }
        return cardSize;
    }, [])

    useEffect(() => {

        let maxCardCount = 0;

        groups.forEach(group => {
            if (group.lists.length > maxCardCount) {
                    maxCardCount = group.lists.length
                }
        })

        const columnWidth = windowWidth;

        let tempCardSize = MAX_CARD_SIZE;

        if (maxCardCount > 0) {
            const calculatedCardSize = calculateAreaDifference(tempCardSize, columnWidth, columnHeight, maxCardCount);
            if (calculatedCardSize > readLineHeight) {
                setReadLineHeight(readLineHeight + 20)
                return;
            }
            if (calculatedCardSize >= MIN_CARD_SIZE) {
                setCardSize(calculatedCardSize)
            } else {
                setCardSize(MIN_CARD_SIZE)
            }

        }

    }, [groups, columnHeight, readLineHeight, calculateAreaDifference])

    useEffect(() => {
        console.log({ cardSize, readLineHeight })
    }, [cardSize, readLineHeight])

    const renderGroupItems = useMemo<React.ReactNode>(() => {
        if (!cardSize) return null;
        return groups.map(g => {
            return (
                <View style={{
                    position: "absolute",
                    height: columnHeight,
                    width: windowWidth,
                    flexDirection: "row",
                }} key={g.id}>
                    <CardColumn
                        ids={g.lists}
                        onDrag={handleDrag}
                        onDrop={onDrop}
                        display={activeGroupId === g.id}
                        activeCards={insideIds}
                        cardSize={cardSize}
                        last={true}
                        currentDraggedInside={currentDraggedInside}
                    />
                </View>
            )
        })
    }, [cardSize, groups, columnHeight, handleDrag, activeGroupId, insideIds, currentDraggedInside]);

    const restartBoard = () => {
        setInsiteIds([])
        setCurrentDraggedInside(null)
        insideCards.current = {}
        refreshBoard()
    }

    return (
        <View style={{ height: '100%' }}>
            <View style={[style.head, { backgroundColor: bacgroundColor }]}>
                <IconButton
                    icon="arrow-left"
                    onPress={goBack}
                    iconColor={theme.colors.primary}
                />
                <Text>{activeGroup?.name}</Text>
                <View
                    style={{
                        flexDirection: 'row'
                    }}
                >
                    <IconButton
                        icon="refresh"
                        onPress={restartBoard}
                        iconColor={theme.colors.primary}
                    />
                    <IconButton
                        icon="pencil"
                        onPress={goToEditMode}
                        iconColor={theme.colors.primary}
                    />
                </View>
            </View>
            <View style={style.boardWrap}>
                <View style={[style.board, { backgroundColor: bacgroundColor, height: columnHeight }]}>
                    {renderGroupItems}
                </View>
                <View>
                    <ScrollView
                        horizontal
                        style={[
                            style.groups,
                            {
                                backgroundColor: theme.colors.background
                            }
                        ]}
                    >
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
                <View
                    style={[
                        style.readLine,
                        {
                            height: readLineHeight,
                            backgroundColor: theme.colors.background,
                            borderWidth: 1,
                            borderColor: dragging ? theme.colors.primary : 'transparent',
                            borderStyle: 'dashed'
                        }
                    ]}
                    ref={dropZoneRef}
                >
                    <View style={style.arrowWrap}>
                        <View style={[style.arrow, { backgroundColor: theme.colors.primary }]} />
                        <View style={style.arrowHead}>
                            <AntDesign name="caret-right" size={25} color={theme.colors.primary} />
                        </View>
                    </View>
                    <View style={style.readLineControls}>
                        <ToggleButton
                            icon="refresh-auto"
                            value="refresh-auto"
                            status={autoSpeak ? 'checked' : 'unchecked'}
                            onPress={() => setAutoSpeak(!autoSpeak)}
                            size={20}
                            disabled={!voicesLoaded}
                        />
                        <IconButton
                            icon="account-voice"
                            onPress={repeatSpeak}
                            disabled={!voicesLoaded}
                        />
                    </View>
                </View>
            </View>
            <FAB
                icon="shape-square-plus"
                style={{
                    position: 'absolute',
                    margin: 16,
                    left: 0,
                    bottom: 0,
                }}
                visible={quickAddEnabled}
                size={"small"}
                onPress={() => {
                    setShowQuickAddModal(true)
                }}
                variant="tertiary"
            />
            <Portal>
                <Modal
                    visible={showQuickAddModal}
                    onDismiss={() => setShowQuickAddModal(false)}
                    contentContainerStyle={{
                        backgroundColor: 'white',
                        aspectRatio: '1/1',
                        width: windowHeight - 20,
                        margin: 10,
                        borderRadius: theme.roundness,
                    }}
                    style={{
                        alignItems: "center"
                    }}

                >
                    <QuickAdd
                        groupId={activeGroupId}
                        onDissmiss={() => setShowQuickAddModal(false)}
                        onAdd={() => {
                            setShowQuickAddModal(false)
                            refreshBoard()
                        }}
                    />
                </Modal>
            </Portal>
        </View>
    )
}

const style = StyleSheet.create({
    head: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 50,
        paddingHorizontal: 40
    },
    headBtn: {
        padding: 10,
    },
    boardWrap: {
        flex: 1
    },
    groups: {
        height: GROUP_HEIGHT,
        flexDirection: "row",
        gap: 5,
        marginTop: -.5,
        overflow: 'visible'
    },
    board: {
        flexDirection: "row",
    },
    readLine: {
        flex: 1,
        position: 'relative',
    },
    readLineControls: {
        position: "absolute",
        top: 0,
        right: 20,
        height: '100%',
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 10,
    },
    arrowWrap: {
        position: 'absolute',
        width: '80%',
        top: '40%',
        left: '5%',
        height: 24
    },
    arrow: {
        position: 'absolute',
        height: 5,
        width: '100%',
        top: 10,
        left: 0,
    },
    arrowHead: {
        position: 'absolute',
        width: 24,
        height: 24,
        right: -10,
        top: 0
    }
})

export default Board
