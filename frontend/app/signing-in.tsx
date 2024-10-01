import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { FetchLoginInfo } from "@/functions/DataFetching";
import { GetLoginInfo, SetAccessTokenResponse } from "@/functions/Storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

async function appSetUp() {
  const { username, password } = await GetLoginInfo();
  if (!username || !password) {
    throw new Error("No username or password found");
  }
  const response = await FetchLoginInfo(username, password);
  await SetAccessTokenResponse(response);
}

export default function SigningIn() {
  useEffect(() => {
    (async () => {
      try {
        await appSetUp();
        router.replace("/fetching-data");
      } catch (e) {
        console.log(e);
        router.replace("/login");
      }
    })()
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text} type="title">
        Singing in...
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
