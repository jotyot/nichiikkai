import { StyleSheet, View, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/themed/ThemedView";
import { getUserLevels, getUserWords } from "@/storage/Storage";
import { useEffect, useState } from "react";
import { WordBase, WordData } from "@/types/Types";
import { WordDisplay } from "@/components/learning/WordDisplay";
import { ThemedText } from "@/components/themed/ThemedText";
import { LearnButton } from "@/components/learning/LearnButton";

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
    const wordBase: WordBase = await response.json();
    const data = await getWordData(wordBase);
    return data;
  } else {
    throw new Error("Failed to get word of the day: " + response);
  }
}

async function getWordData(word: WordBase) {
  const response = await fetch(
    "https://dictionary-952837685482.us-west1.run.app/Dictionary/" +
      word.word +
      "/" +
      word.reading
  );
  if (response.status === 200) {
    const data: WordData = await response.json();
    return data;
  } else {
    throw new Error("Failed to get word data: " + response);
  }
}

export default function HomeScreen() {
  const [wordOfTheDay, setWordOfTheDay] = useState<WordData | null>(null);

  useEffect(() => {
    getWordOfTheDay()
      .then((word) => {
        setWordOfTheDay(word);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
      <ThemedView style={styles.container}>
        <WordDisplay word={wordOfTheDay} />
        <LearnButton onPress={() => {}} />
      </ThemedView>
      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
