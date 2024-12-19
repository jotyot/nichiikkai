import { router } from "expo-router";
import ReviewsScreen from "@/components/reviews/ReviewsScreen";
import { useEffect } from "react";
import {
  GetReviewQueue,
  GetAccessTokenResponse,
  SetUserWords,
} from "@/functions/Storage";
import { Reviewer, ToWordPair } from "@/functions/Reviewer";
import { useRef } from "react";
import { useState } from "react";
import ThemedView from "@/components/themed/ThemedView";
import { StyleSheet } from "react-native";
import ExitHeader from "@/components/learning/ExitHeader";
import Summary from "@/components/learning/Summary";
import {
  GETUserWords,
  PUTDecrementLevel,
  PUTIncrementLevel,
} from "@/functions/APICalls";

export default function Reviews() {
  const reviewer = useRef<Reviewer>();
  const [reviewLoaded, setReviewLoaded] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [correctSet, setCorrectSet] = useState(new Set<string>());
  const [incorrectSet, setIncorrectSet] = useState(new Set<string>());
  const [summaryExitLock, setSummaryExitLock] = useState(true);

  useEffect(() => {
    (async () => {
      const reviewQueue = await GetReviewQueue();
      reviewer.current = new Reviewer(reviewQueue);
      setReviewLoaded(true);
    })();
  }, []);

  async function ExitReviews() {
    if (!reviewLoaded) return;
    if (!reviewer.current) throw new Error("No reviewer");

    if (reviewer.current.GetCompleted().size === 0) {
      router.replace("/(tabs)/review");
      return;
    }

    setShowSummary(true);
    const correctSet = reviewer.current.GetCorrect();
    const incorrectSet = reviewer.current.GetFailed();
    setCorrectSet(correctSet);
    setIncorrectSet(incorrectSet);

    const accessToken = (await GetAccessTokenResponse()).accessToken;
    const increments = Array.from(correctSet).map((word) =>
      PUTIncrementLevel(accessToken, ToWordPair(word))
    );
    const decrements = Array.from(incorrectSet).map((word) =>
      PUTDecrementLevel(accessToken, ToWordPair(word))
    );
    await Promise.all([...increments, ...decrements]);
    await new Promise((r) => setTimeout(r, 1000));
    const userWords = await GETUserWords(accessToken);
    await SetUserWords(userWords);
    setSummaryExitLock(false);
  }

  return !showSummary ? (
    <ThemedView style={styles.container}>
      <ExitHeader handleExit={ExitReviews} />
      {reviewLoaded && (
        <ReviewsScreen handleExit={ExitReviews} reviewer={reviewer} />
      )}
    </ThemedView>
  ) : (
    <Summary
      correctSet={correctSet}
      incorrectSet={incorrectSet}
      mode="review"
      lock={summaryExitLock}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
