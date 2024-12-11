import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed/ThemedView";
import {
  GetLastWordDate,
  GetUserLevels,
  GetUserWords,
  GetWordOfTheDay,
  SetLastWordDate,
  SetReviewQueue,
  SetWordOfTheDay,
} from "@/functions/Storage";
import { useEffect, useState } from "react";
import { WordBase, WordData } from "@/types/Types";
import { WordDisplay } from "@/components/learning/WordDisplay";
import { LearnButton } from "@/components/learning/LearnButton";
import { router } from "expo-router";
import { GETWordData, GETWordOfTheDay } from "@/functions/APICalls";

async function generateWordOfTheDay() {
  const userLevels = await GetUserLevels();
  const userWords = await GetUserWords();

  const wordBase: WordBase = await GETWordOfTheDay(userLevels, userWords);
  const chosenWordBase = await chooseWordBase(wordBase);
  const data = await GETWordData(chosenWordBase);

  return data;
}

// so it takes one day to get a new word of the day
async function chooseWordBase(apiCallWordBase: WordBase): Promise<WordBase> {
  try {
    const lastWordDate = await GetLastWordDate();
    if (new Date().toLocaleDateString() === lastWordDate) {
      return await GetWordOfTheDay();
    } else {
      throw new Error("No word of the day found");
    }
  } catch (e) {
    await SetLastWordDate(new Date().toLocaleDateString());
    await SetWordOfTheDay(apiCallWordBase);
    return apiCallWordBase;
  }
}

export default function HomeScreen() {
  const [wordOfTheDayState, setWordOfTheDayState] = useState<WordData | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const wordOfTheDay = await generateWordOfTheDay();
      setWordOfTheDayState(wordOfTheDay);
    })();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <WordDisplay word={wordOfTheDayState} />
      {wordOfTheDayState && (
        <LearnButton
          onPress={async () => {
            const wordBase = wordOfTheDayState.wordBase;
            await SetReviewQueue([
              // wordBase.word +
              //   "@" +
              //   wordBase.reading,
              "test1",
              "test2",
              "test3",
            ]);
            router.replace("/reviews");
          }}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
