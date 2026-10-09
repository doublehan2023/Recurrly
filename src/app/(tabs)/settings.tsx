import { useClerk, useUser } from "@clerk/expo";
import { useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const email = user?.primaryEmailAddress?.emailAddress ?? "Signed in member";
  const name = user?.fullName || user?.firstName || "Your account";
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-5">
      <View className="mt-6">
        <Text className="text-3xl font-sans-bold text-primary">Settings</Text>
        <Text className="mt-2 text-base font-sans-medium text-muted-foreground">
          Manage your Recurrly account.
        </Text>
      </View>
      <View className="mt-8 rounded-3xl border border-border bg-card p-5">
        <View className="flex-row items-center">
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="size-14 rounded-full"
            />
          ) : (
            <View className="size-14 items-center justify-center rounded-full bg-accent">
              <Text className="text-lg font-sans-extrabold text-primary">
                {initials}
              </Text>
            </View>
          )}
          <View className="ml-4 min-w-0 flex-1">
            <Text
              className="text-lg font-sans-bold text-primary"
              numberOfLines={1}
            >
              {name}
            </Text>
            <Text
              className="mt-1 text-sm font-sans-medium text-muted-foreground"
              numberOfLines={1}
            >
              {email}
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          className={
            isSigningOut
              ? "mt-6 items-center rounded-2xl bg-primary/40 py-4"
              : "mt-6 items-center rounded-2xl bg-primary py-4"
          }
          disabled={isSigningOut}
          onPress={handleSignOut}
        >
          {isSigningOut ? (
            <ActivityIndicator color="#fff9e3" />
          ) : (
            <Text className="font-sans-bold text-background">Sign out</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
