import AddKidButton from "@/components/AddKidButton";
import SettingsButton from "@/components/SettingsButton";
import useTranslation from "@/localization";
import STORAGE from "@/storage";
import { store } from "@/store";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { MD3DarkTheme, MD3LightTheme, PaperProvider, useTheme } from 'react-native-paper';
import Header from "@/components/Header";
import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from "react-native";

import { Skyflare } from "@/themes/skyflare";
import { Playful } from "@/themes/playful";
import { Amoled } from "@/themes/amoled";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const schema = SecureStore.getItem('themeColorSchema')

  const paperTheme = useMemo(() => {
    switch (schema) {
      case 'auto':
        if (colorScheme === 'dark') return MD3DarkTheme
        if (colorScheme === 'light') return MD3LightTheme
        return MD3LightTheme
      case 'light':
        return MD3LightTheme
      case 'dark':
        return MD3DarkTheme
      case 'skyflare-light':
        return {
          ...MD3LightTheme,
          colors: {
            ...Skyflare.light
          }
        }
      case 'skyflare-dark':
        return {
          ...MD3DarkTheme,
          colors: {
            ...Skyflare.dark
          }
        }
      case 'playful-light':
        return {
          ...MD3LightTheme,
          colors: {
            ...Playful.light
          }
        }
      case 'playful-dark':
        return {
          ...MD3DarkTheme,
          colors: {
            ...Playful.dark
          }
        }
      case 'amoled':
        return {
          ...MD3DarkTheme,
          colors: {
            ...Amoled.dark
          }
        }
      default:
        return MD3LightTheme
    }
  }, [colorScheme, schema])

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
    <PaperProvider theme={{ ...paperTheme }}>
      <GestureHandlerRootView>
        <Provider store={store}>
          <StatusBar
            hidden
          />
          <Stack
            screenOptions={{
              header: (props) => (<Header {...props} />)
            }}
          />
        </Provider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
