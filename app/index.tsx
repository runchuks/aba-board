import KidsCard from "@/components/KidsCard";
import SettingsButton from "@/components/SettingsButton";
import useTranslation from "@/localization";
import { useNavigation } from "expo-router";
import { useEffect, useMemo } from "react";
import { Button, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";


export default function Index() {
  const { kids, lang } = useSelector(state => state.global)
  const navigation = useNavigation()
  const t = useTranslation()

  const renderKids = useMemo(() => {
    return kids.map(kid => <KidsCard {...kid} key={kid.id}/>)
  }, [kids])

  useEffect(() => {
    navigation.setOptions({
      title: t('Users'),
      headerRight: () => <SettingsButton />
    });
  }, [lang])

  return (
    <View>
      <ScrollView style={style.scrollWrap}>
        <View style={style.wrap}>
          {renderKids}
        </View>
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    padding: 20
  },
  scrollWrap: {
    width: '100%'
  }
})
