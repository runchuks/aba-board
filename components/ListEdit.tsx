import { Item } from "@/types"
import { FC, useState } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';

interface Props {
    list: Item[]
}

const ListEdit: FC<Props> = ({ list }) => {
    const [showModal, setShowModal] = useState<boolean>(false)

    const addItem = () => {
        setShowModal(true)
    }
    return (
        <View style={style.wrap}>
            <TouchableOpacity style={style.addItem} onPress={addItem}>
                <AntDesign name="plus" size={24} color="grey" />
            </TouchableOpacity>

            <Modal
                visible={showModal}
                animationType='slide'
                transparent
                onRequestClose={() => {
                    setShowModal(false);
                }}
            >
                <View style={style.centeredView}>
                    <View style={style.innerModalWrap}>
                        
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const style = StyleSheet.create({
    wrap: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10
    },
    addItem: {
        borderWidth: 2,
        borderColor: 'grey',
        alignItems: "center",
        justifyContent: "center",
    },
    innerModalWrap: {
        borderWidth: 1,
        width: 500,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: '#fff',
        padding: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default ListEdit
