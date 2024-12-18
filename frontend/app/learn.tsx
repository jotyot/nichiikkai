import { router } from "expo-router";
import ReviewsScreen from "@/components/reviews/ReviewsScreen";
import { useEffect } from "react";
import { GetReviewQueue, SetUserWords } from "@/functions/Storage";
import { Reviewer, ToWordPair } from "@/functions/Reviewer";
import { useRef } from "react";
import { useState } from "react";
import ThemedView from "@/components/themed/ThemedView";
import { StyleSheet } from "react-native";
import ExitHeader from "@/components/learning/ExitHeader";
import Summary from "@/components/learning/Summary";
import { GetAccessTokenResponse } from "@/functions/Storage";
import { GETUserWords, POSTAddUserWord } from "@/functions/APICalls";

export default function Learn() {
  const reviewer = useRef<Reviewer>();
  const [reviewLoaded, setReviewLoaded] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [correctSet, setCorrectSet] = useState(new Set<string>());

  useEffect(() => {
    (async () => {
      const reviewQueue = await GetReviewQueue();
      reviewer.current = new Reviewer(reviewQueue);
      setReviewLoaded(true);
    })();
  });

  async function ExitLearning() {
    if (!reviewLoaded) return;
    if (!reviewer.current) throw new Error("No reviewer");
    setCorrectSet(reviewer.current.GetCompleted());
    setShowSummary(true);
    const completed = reviewer.current.GetCompleted();
    if (completed.size === 0) return;

    const accessToken = (await GetAccessTokenResponse()).accessToken;
    await Promise.all(
      Array.from(completed).map(async (word) => {
        POSTAddUserWord(accessToken, ToWordPair(word));
      })
    );
    await new Promise((r) => setTimeout(r, 1000));
    const userWords = await GETUserWords(accessToken);
    await SetUserWords(userWords);
  }

  return !showSummary ? (
    <ThemedView style={styles.container}>
      <ExitHeader handleExit={ExitLearning} />
      {reviewLoaded && (
        <ReviewsScreen handleExit={ExitLearning} reviewer={reviewer} />
      )}
    </ThemedView>
  ) : (
    <Summary correctSet={correctSet} incorrectSet={new Set()} mode="learn" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
