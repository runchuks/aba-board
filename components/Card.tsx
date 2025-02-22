import React, { FC, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Animated, Text, ImageBackground } from 'react-native';

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
  image: string
}

const Card: FC<Props> = ({ id, name, onDrag, onDrop, display, index, left, top, cardSize, image }) => {
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
      <View style={[style.innerWrap, {
        width: cardSize - 20,
        height: cardSize - 20,
      }]}>
        <ImageBackground
          source={{ uri: image || undefined }}
          style={{ width: '100%', height: '100%' }}
          resizeMode='cover'

        >
          <View
            style={{
              backgroundColor: image ? 'rgba(255,255,255,.3)' : 'transparent',
              // backgroundColor: 'red',
              width: cardSize - 20,
              height: image ? 20 : cardSize - 20,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: 0,
              left: 0
            }}
          >
            <Text style={style.text}>{name}</Text>
          </View>
        </ImageBackground>
      </View >
    </Animated.View >
  );
};

const style = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    position: 'absolute',
  },
  innerWrap: {
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
});

export default Card;
