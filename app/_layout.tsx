import AddKidButton from "@/components/AddKidButton";
import SettingsButton from "@/components/SettingsButton";
import useTranslation from "@/localization";
import STORAGE from "@/storage";
import { store } from "@/store";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

export default function RootLayout() {

  const t = useTranslation();

  useEffect(() => {
    STORAGE.initDb();
    STORAGE.enableForeignKeys();
    STORAGE.migration();
  }, [])

  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <StatusBar
          hidden
        />
        <Stack />
      </Provider>
    </GestureHandlerRootView>
  );
}
