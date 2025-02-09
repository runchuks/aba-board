import AddKidButton from "@/components/AddKidButton";
import SettingsButton from "@/components/SettingsButton";
import useTranslation from "@/localization";
import { store } from "@/store";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";

export default function RootLayout() {

  const t = useTranslation();

  return (
    <Provider store={store}>
      <StatusBar
        hidden
      />
      <Stack />
    </Provider>
  );
}
