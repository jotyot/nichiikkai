import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { getLoginInfo } from "@/storage/Storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

// checks if there is a username and password in storage, redirects to login page if not
export default function Index() {
  useEffect(() => {
    getLoginInfo().then(({ username, password }) => {
      if (!username || !password) {
        router.replace("/login");
      } else {
        router.replace("/signing-in");
      }
    });
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text} type="title">
        Welcome to the app!
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  text: {
    fontSize: 24,
    marginVertical: 20,
  },
});
