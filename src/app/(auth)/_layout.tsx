import { Stack } from "expo-router";
import "../../../global.css";

export default function RootLayout() {
  return (
    <Stack initialRouteName="signIn" screenOptions={{ headerShown: false }} />
  );
}
