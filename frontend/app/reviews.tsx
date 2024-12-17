import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { GetReviewQueue } from "@/functions/Storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Reviewer } from "@/functions/Reviewer";
import { WordData } from "@/types/Types";
import { ReviewInput } from "@/components/reviews/ReviewInput";

export default function ReviewsScreen() {
  const reviewer = useRef<Reviewer | null>(null);
  const wordData = useRef<Map<string, WordData>>(new Map());

  const [displayWord, setDisplayWord] = useState<string | undefined>(undefined);
  const [displayType, setDisplayType] = useState<"reading" | "meaning">(
    "reading"
  );

  const [userInput, setUserInput] = useState<string>("");

  const displayNextReview = (reviewer: Reviewer) => {
    const { word, type } = reviewer.GetCurrentReviewEntry();
    setDisplayWord(word);
    setDisplayType(type);
  };

  useEffect(() => {
    (async () => {
      const reviewQueue = await GetReviewQueue();
      reviewer.current = new Reviewer(reviewQueue);
      displayNextReview(reviewer.current);
    })();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.filler} />
      <ThemedText style={styles.wordText} type="title">
        {displayWord ?? "No words to review"}
      </ThemedText>
      <ThemedText style={styles.typeText} type="subtitle">
        {displayType === "reading" ? "Reading" : "Meaning"}
      </ThemedText>
      <ReviewInput
        input={userInput}
        setInput={setUserInput}
        onSubmit={() => {}}
        type={displayType}
      />
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
});
