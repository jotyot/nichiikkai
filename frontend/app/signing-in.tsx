import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { getLoginInfo, setAccessTokenResponse } from "@/functions/Storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

async function appSetUp() {
  const { username, password } = await getLoginInfo();
  try {
    const response = await fetch(
      "https://backend-image-952837685482.us-central1.run.app/identity/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password: password }),
      }
    )
    if (response.status === 200) {
      const data = await response.json();
      await setAccessTokenResponse(data);
    } else {
      console.log("response status not 200: " + response.status);
    }
  } catch (e) {
    console.log(e);
  }
}

export default function SigningIn() {
  useEffect(() => {
    appSetUp().then(() => {
      router.replace("/fetching-data");
    });
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
