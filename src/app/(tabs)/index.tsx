import { Link } from "expo-router";
import "../../../global.css";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link href="/onBoarding" asChild>
        <Pressable className="mt-4 rounded bg-primary px-4 py-3">
          <Text className="font-semibold text-white">Go to Onboarding</Text>
        </Pressable>
      </Link>
      <Link href="/(auth)/signIn" asChild>
        <Pressable className="mt-4 rounded bg-primary px-4 py-3">
          <Text className="font-semibold text-white">Go to Sign In</Text>
        </Pressable>
      </Link>
      <Link href="/(auth)/signUp" asChild>
        <Pressable className="mt-4 rounded bg-primary px-4 py-3">
          <Text className="font-semibold text-white">Go to Sign Up</Text>
        </Pressable>
      </Link>

      <Link href="/subscriptions/spotify">Spotify Subscription</Link>
      <Link href={
        {
          pathname: "/subscriptions/[id]",
          params: { id: "chatgpt-plus" }
        }
      }>ChatGPT Plus Subscription</Link>
    </SafeAreaView>
  );
}
