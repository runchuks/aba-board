import AddKidButton from "@/components/AddKidButton";
import SettingsButton from "@/components/SettingsButton";
import useTranslation from "@/localization";
import { store } from "@/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

export default function RootLayout() {
  const t = useTranslation();
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen
          name="index" 
          options={{
            title: t('Kids'),
            headerRight: () => <SettingsButton />
          }}
        />

        <Stack.Screen
          name="settings" 
          options={{
            title: t('Settings'),
          }}
        />
      </Stack>
    </Provider>
  );
}
