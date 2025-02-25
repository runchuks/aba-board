import UserCard from "@/components/UserCard";
import SettingsButton from "@/components/SettingsButton";
import useTranslation from "@/localization";
import STORAGE from "@/storage";
import { useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { User } from "@/types";
import { useTheme } from 'react-native-paper';


export default function Index() {
  const { lang } = useSelector(state => state.global)
  const navigation = useNavigation()
  const t = useTranslation()
  const theme = useTheme();

  const [users, setUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const renderKids = useMemo(() => {
    return users.map(user => <UserCard {...user} key={user.id} />)
  }, [users])

  const refreshUsers = () => {
    setRefreshing(true);
    STORAGE.fetchUsers().then((users) => {
      setUsers(users)
      setRefreshing(false)
    });
  }

  useEffect(() => {
    navigation.setOptions({
      title: t('Users'),
      headerRight: () => <SettingsButton />,
    });
  }, [lang])

  useEffect(() => {
    refreshUsers()
  }, [navigation])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshUsers()
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ backgroundColor: theme.colors.background, height: '100%' }}>
      <ScrollView
        style={style.scrollWrap}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshUsers} />
        }
      >
        <View style={[style.wrap]}>
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
