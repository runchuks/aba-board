import React, { FC, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Animated, Text } from 'react-native';

interface Props {
  id: number
  name: string;
  onDrag: (id: number, x: number, y: number) => void;
  onDrop: (id: number) => void
  display: boolean
  index: number
  left: number
  top: number
  cardSize: number
}

const Card: FC<Props> = ({ id, name, onDrag, onDrop, display, index, left, top, cardSize }) => {
  const position = useRef(new Animated.ValueXY()).current;
  const [dragging, setDragging] = useState(false);

  const dragged = useRef<boolean>(false);

  // useEffect(() => {
  //   if (dragging) {
  //     dragged.current = true;
  //   }
  // }, [dragging])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.setOffset({
          x: position.x._value,
          y: position.y._value,
        });
        position.setValue({ x: 0, y: 0 });
        setDragging(true);
        dragged.current = true;
      },
      onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], {
        useNativeDriver: false,
        listener: (event, gesture) => {
          onDrag(id, gesture.moveX, gesture.moveY); // Pass current coordinates
        },
      }),
      onPanResponderRelease: () => {
        position.flattenOffset();
        setDragging(false);
        onDrop(id)
      },
      onPanResponderTerminate: () => {
        position.flattenOffset();
        setDragging(false);
        onDrop(id)
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        style.wrap,
        {
          width: cardSize,
          height: cardSize,
          transform: position.getTranslateTransform(),
          opacity: dragging ? 0.8 : 1,
          display: display ? 'flex' : 'none',
          left,
          top,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={style.innerWrap}>
        <Text style={style.text}>{name}</Text>
      </View>
    </Animated.View>
  );
};

const style = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    position: 'absolute',
    padding: 10,
  },
  innerWrap: {
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    padding: 5,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Card;
