import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed/ThemedView";
import { getLastWordDate, getUserLevels, getUserWords, getWordOfTheDay, setLastWordDate, setReviewQueue, setWordOfTheDay } from "@/functions/Storage";
import { useEffect, useState } from "react";
import { WordBase, WordData } from "@/types/Types";
import { WordDisplay } from "@/components/learning/WordDisplay";
import { LearnButton } from "@/components/learning/LearnButton";
import { router } from "expo-router";

async function generateWordOfTheDay() {
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
    
    const chosenWordBase = await chooseWordBase(wordBase); 

    const data = await generateWordData(chosenWordBase);
    return data;
  } else {
    throw new Error("Failed to get word of the day: " + response);
  }
}

async function generateWordData(word: WordBase) {
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

// so it takes one day to get a new word of the day  
async function chooseWordBase(apiCallWordBase: WordBase) : Promise<WordBase>{
  if (new Date().toLocaleDateString() === await getLastWordDate()) {
    return await getWordOfTheDay();
  }
  else {
    await setLastWordDate(new Date().toLocaleDateString());
    await setWordOfTheDay(apiCallWordBase);
    return apiCallWordBase;
  }
}

export default function HomeScreen() {
  const [wordOfTheDayState, setWordOfTheDayState] = useState<WordData | null>(null);

  useEffect(() => {
    generateWordOfTheDay()
      .then((word) => {
        setWordOfTheDayState(word);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
      <ThemedView style={styles.container}>   
          <WordDisplay word={wordOfTheDayState} />
        {wordOfTheDayState && 
          <LearnButton onPress={async () => {
            await setReviewQueue([
              wordOfTheDayState.wordBase.word + "@" + wordOfTheDayState.wordBase.reading
            ]);
            router.replace("/reviews");
          }} />
        }
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
