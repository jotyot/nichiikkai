import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { GetReviewQueue } from "@/functions/Storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Reviewer } from "@/functions/Reviewer";
import { WordData } from "@/types/Types";
import { NamedField } from "@/components/logins/NamedField";

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
      <ThemedText style={styles.text} type="title">
        {displayWord ?? "No words to review"}
      </ThemedText>
      <NamedField
        name={displayType}
        fieldContent={userInput}
        setFieldContent={setUserInput}
      />
    </ThemedView>
  );
}

export async function ExitReviews () {
  router.replace("/(tabs)");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    marginVertical: 20,
  },
});
