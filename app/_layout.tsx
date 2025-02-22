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
    STORAGE.checkDatabaseStructure().then((missingColumns) => {
      if (Object.keys(missingColumns).length === 0) {
        console.log("Database structure is correct.");
      } else {
        STORAGE.addMissingColumns(missingColumns);
      }
    }).catch((error) => {
      console.error("Error checking database structure:", error);
    });
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
