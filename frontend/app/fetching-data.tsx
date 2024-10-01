import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { GETUserLevels, GETUserWords } from "@/functions/APICalls";
import {
  GetAccessTokenResponse,
  SetUserLevels,
  SetUserWords,
} from "@/functions/Storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

async function appSetUp() {
  try {
    const accessToken = (await GetAccessTokenResponse()).accessToken;
    const userWords = await GETUserWords(accessToken);
    const userLevels = await GETUserLevels(accessToken);
    await SetUserWords(userWords);
    await SetUserLevels(userLevels);
  } catch (e) {
    console.log(e);
  }
}

// checks if there is a username and password in storage, redirects to login page if not
export default function FetchingData() {
  useEffect(() => {
    appSetUp().then(() => {
      router.replace("/(tabs)");
    });
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text} type="title">
        Fetching Data...
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
