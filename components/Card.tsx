import { setLastDragged } from '@/store/slices/global';
import React, { FC, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Animated, Text, ImageBackground } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

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
  active: boolean
}

const Card: FC<Props> = ({ id, name, onDrag, onDrop, display, index, left, top, cardSize, image, active }) => {
  const { lastDragged } = useSelector(state => state.global)
  const dispatch = useDispatch()
  const theme = useTheme();
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
        dispatch(setLastDragged(id));
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
          display: display ? 'flex' : 'none',
          left,
          top,
          zIndex: dragging || lastDragged === id ? 10 : 1
        }
      ]}
      {...panResponder.panHandlers}
    >
      <View style={[
        style.innerWrap,
        {
          width: cardSize - 20,
          height: cardSize - 20,
          backgroundColor: image ? 'rgba(126, 126, 126, 0.55)' : '#fff',
          borderColor: theme.colors.primary,
        },
        dragging && style.dragging,
        active && style.active
      ]}>
        <ImageBackground
          source={{ uri: image || undefined }}
          style={{ width: '100%', height: '100%' }}
          resizeMode='cover'

        >
          <View
            style={[
              {
                backgroundColor: image ? 'rgba(255, 255, 255, 0.57)' : 'transparent',
                width: cardSize - 20,
                height: image ? 20 : cardSize - 20,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: 0,
                left: 0
              }
            ]}
          >
            <Text
              adjustsFontSizeToFit={true}
              numberOfLines={image ? 1 : 5}
              style={style.text}
            >
              {name.trim()}
            </Text>
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
    position: 'absolute',
  },
  innerWrap: {
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dragging: {
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 20,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  active: {
    borderStyle: 'dashed'
  }
});

export default Card;
