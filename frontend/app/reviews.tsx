import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { GetReviewQueue } from "@/functions/Storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Reviewer } from "@/functions/Reviewer";
import { WordData, WordPair } from "@/types/Types";
import { ReviewInput } from "@/components/reviews/ReviewInput";
import { GETWordData } from "@/functions/APICalls";
import { ReviewInfo } from "@/components/reviews/ReviewInfo";
import { FuzzyMatch } from "@/functions/FuzzyMatch";
import { isKana } from "wanakana";

export default function ReviewsScreen() {
  const reviewer = useRef<Reviewer | undefined>();
  const wordDataMap = useRef<Map<string, WordData>>(new Map());

  const [displayWord, setDisplayWord] = useState<string | undefined>(undefined);
  const [reviewType, setReviewType] = useState<"reading" | "meaning">(
    "reading"
  );

  const [currentWordData, setCurrentWordData] = useState<
    WordData | undefined
  >();

  const [userInput, setUserInput] = useState<string>("");

  const displayNextReview = async () => {
    if (!reviewer.current) throw new Error("No reviewer");

    const { wordPair, type } = reviewer.current.GetCurrentReviewEntry();

    if (!wordPair) {
      await ExitReviews();
      return;
    }

    const word = wordPair?.split("@")[0];
    setDisplayWord(word);
    setReviewType(type);
    if (wordPair) setCurrentWordData(wordDataMap.current.get(wordPair));

    await loadNextWordData();
  };

  const loadNextWordData = async () => {
    if (!reviewer.current) throw new Error("No reviewer");

    const nextWordPair = reviewer.current.GetNextReviewEntry();
    if (nextWordPair) {
      const wordData = await GETWordData(toWordPair(nextWordPair));
      wordDataMap.current.set(nextWordPair, wordData);
    }
  };

  const toWordPair = (wordPair: string): WordPair => {
    try {
      const word = wordPair.split("@")[0];
      const reading = wordPair.split("@")[1];
      return { word, reading };
    } catch (e) {
      throw new Error("Invalid word pair");
    }
  };

  const checkAnswer = (): boolean => {
    if (currentWordData === undefined) throw new Error("No word data");
    if (reviewType === "reading") {
      return currentWordData.readings.includes(userInput);
    }
    return FuzzyMatch(userInput, currentWordData.meanings, 2);
  };

  const handleSubmit = async () => {
    if (!reviewer.current) throw new Error("No reviewer");

    if (reviewType === "reading" && !isKana(userInput)) return;

    const correct = checkAnswer();
    console.log(correct);
    setUserInput("");
    reviewer.current.GiveAnswer(correct);
    await displayNextReview();
  };

  useEffect(() => {
    (async () => {
      const reviewQueue = await GetReviewQueue();
      reviewer.current = new Reviewer(reviewQueue);

      const { wordPair } = reviewer.current.GetCurrentReviewEntry();
      if (!wordPair) throw new Error("No words to review");
      const wordData = await GETWordData(toWordPair(wordPair));
      wordDataMap.current.set(wordPair, wordData);

      await displayNextReview();
    })();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.filler} />
      <ThemedText style={styles.wordText} type="title">
        {displayWord ?? "NaN"}
      </ThemedText>
      <ThemedText style={styles.typeText} type="subtitle">
        {reviewType === "reading" ? "Reading" : "Meaning"}
      </ThemedText>
      <ReviewInput
        input={userInput}
        setInput={setUserInput}
        onSubmit={handleSubmit}
        type={reviewType}
      />
      <ThemedView style={styles.wordInfo}>
        <ReviewInfo wordData={currentWordData} />
      </ThemedView>
    </ThemedView>
  );
}

export async function ExitReviews() {
  router.replace("/(tabs)");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  filler: {
    height: 100,
  },
  wordText: {
    fontSize: 50,
    marginVertical: 20,
  },
  typeText: {
    fontSize: 25,
    marginBottom: 20,
  },
  wordInfo: {
    marginTop: 20,
    alignItems: "flex-start",
    width: "30%",
  },
});
