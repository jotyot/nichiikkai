import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { WideButton } from "@/components/logins/WideButton";
import {
  getUserLevels,
  getUserWords,
  removeLoginInfo,
} from "@/storage/Storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { WordBase } from "@/types/Types";

async function getWordOfTheDay() {
  const userLevels = await getUserLevels();
  const userWords = await getUserWords();
  const response = await fetch(
    "https://dictionary-952837685482.us-west1.run.app/Dictionary/generate-word" +
      "?levels=" +
      userLevels.join("&levels="),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        userWords.map((word) => ({ word: word.word, reading: word.reading }))
      ),
    }
  );
  if (response.status === 200) {
    const data: WordBase = await response.json();
    return data;
  } else {
    throw new Error("Failed to get word of the day: " + response);
  }
}

export default function HomeScreen() {
  const [loaded, setLoaded] = useState(false);
  const [wordOfTheDay, setWordOfTheDay] = useState<WordBase | null>(null);

  useEffect(() => {
    getWordOfTheDay()
      .then((word) => {
        setWordOfTheDay(word);
        setLoaded(true);
      })
      .catch((error) => {
        console.error(error);
        setLoaded(true);
      });
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText>
        {loaded ? JSON.stringify(wordOfTheDay) : "Loading..."}
      </ThemedText>
      <WideButton
        text="Log out"
        onPress={async () => {
          await removeLoginInfo();
          router.replace("/login");
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});
