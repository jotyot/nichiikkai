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
import { FetchWordData, FetchWordOfTheDay } from "@/functions/DataFetching";

async function generateWordOfTheDay() {
  const userLevels = await GetUserLevels();
  const userWords = await GetUserWords();

  const wordBase: WordBase = await FetchWordOfTheDay(userLevels, userWords);
  const chosenWordBase = await chooseWordBase(wordBase);
  const data = await FetchWordData(chosenWordBase);

  return data;
}

// so it takes one day to get a new word of the day
async function chooseWordBase(apiCallWordBase: WordBase): Promise<WordBase> {
  if (new Date().toLocaleDateString() === (await GetLastWordDate())) {
    return await GetWordOfTheDay();
  } else {
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
    })()
  }, []);

  return (
    <ThemedView style={styles.container}>
      <WordDisplay word={wordOfTheDayState} />
      {wordOfTheDayState && (
        <LearnButton
          onPress={async () => {
            await SetReviewQueue([
              wordOfTheDayState.wordBase.word +
                "@" +
                wordOfTheDayState.wordBase.reading,
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
