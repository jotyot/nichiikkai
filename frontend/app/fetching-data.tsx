import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import {
  getAccessTokenResponse,
  getLoginInfo,
  setAccessTokenResponse,
  setUserLevels,
  setUserWords,
} from "@/storage/Storage";
import { UserWord } from "@/types/Types";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

async function appSetUp() {
  try {
    const userWords = await getUserWords();
    const userLevels = await getUserLevels();
    await setUserWords(userWords);
    await setUserLevels(userLevels);
  } catch (e) {
    console.log(e);
  }
}

async function getUserWords() {
  const accessTokenResponse = await getAccessTokenResponse();
  const accessToken = accessTokenResponse.accessToken;
  const response = await fetch(
    "https://backend-image-952837685482.us-central1.run.app/NIK/words",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  if (response.status === 200) {
    const data: UserWord[] = await response.json();
    return data;
  } else {
    throw new Error("Failed to get user data: " + JSON.stringify(response));
  }
}

async function getUserLevels() {
  const accessTokenResponse = await getAccessTokenResponse();
  const accessToken = accessTokenResponse.accessToken;
  const response = await fetch(
    "https://backend-image-952837685482.us-central1.run.app/NIK/selected-levels",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  if (response.status === 200) {
    const data: string[] = await response.json();
    return data;
  } else {
    throw new Error("Failed to get user levels: " + JSON.stringify(response));
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
