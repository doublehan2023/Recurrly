import { Link } from "expo-router";
import "../../../global.css";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-7xl font-sans-extrabold text-primary">
        Home
      </Text>
      <Link href="/onBoarding" asChild>
        <Pressable className="mt-4 rounded bg-primary px-4 py-3">
          <Text className="font-sans-bold text-white">Go to Onboarding</Text>
        </Pressable>
      </Link>
      <Link href="/(auth)/signIn" asChild>
        <Pressable className="mt-4 rounded bg-primary px-4 py-3">
          <Text className="font-sans-bold text-white">Go to Sign In</Text>
        </Pressable>
      </Link>
      <Link href="/(auth)/signUp" asChild>
        <Pressable className="mt-4 rounded bg-primary px-4 py-3">
          <Text className="font-sans-bold text-white">Go to Sign Up</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}
