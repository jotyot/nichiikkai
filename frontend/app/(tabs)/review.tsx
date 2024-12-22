import ThemedText from "@/components/themed/ThemedText";
import ThemedView from "@/components/themed/ThemedView";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { GetUserWords, SetReviewQueue } from "@/functions/Storage";
import { UserWord } from "@/types/Types";
import ReviewForecast from "@/components/learning/ReviewForcast";

function calculateDaysDifference(startDate: Date, endDate: Date) {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const differenceInMilliseconds = Math.abs(
    endDate.valueOf() - startDate.valueOf()
  );
  const differenceInDays = Math.round(differenceInMilliseconds / oneDay);
  return differenceInDays;
}

function countUserWords(userWords: UserWord[]): Map<number, number> {
  const countMap = new Map<number, number>();
  for (const word of userWords) {
    const daysDifference = calculateDaysDifference(
      new Date(),
      new Date(word.nextReviewDay)
    );
    const count = countMap.get(daysDifference);
    if (count) {
      countMap.set(daysDifference, count + 1);
    } else {
      countMap.set(daysDifference, 1);
    }
  }
  return countMap;
}

export default function ReviewHomeScreen() {
  const borderColor = useThemeColor({}, "text");
  const [reviewCount, setReviewCount] = useState(0);
  const reviewList = useRef<string[]>([]);
  const [reviewCountMap, setReviewCountMap] = useState(
    new Map<number, number>()
  );

  useEffect(() => {
    (async () => {
      const userWords = await GetUserWords();
      setReviewCountMap(countUserWords(userWords));
      const wordsToReview = userWords
        .filter((word) => new Date(word.nextReviewDay) <= new Date())
        .map((word) => word.word + "@" + word.reading);

      reviewList.current = wordsToReview;
      setReviewCount(wordsToReview.length);
    })();
  }, []);

  const handleReviewButton = () => {
    if (reviewList.current.length === 0) return;

    SetReviewQueue(reviewList.current);
    router.replace("/reviews");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.reviewDisplay, { borderColor: borderColor }]}>
        <ThemedText style={styles.text} type="title">
          {reviewCount === 0
            ? "No words to review"
            : reviewCount + " words to review"}
        </ThemedText>
      </ThemedView>
      <ThemedView
        style={[
          styles.reviewButton,
          {
            borderColor: borderColor,
            backgroundColor: reviewCount === 0 ? "gray" : "salmon",
          },
        ]}
        onTouchEnd={handleReviewButton}
      >
        <ThemedText style={styles.text} type="subtitle">
          Start Reviews
        </ThemedText>
      </ThemedView>
      <ReviewForecast reviewCountMap={reviewCountMap} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
  reviewDisplay: {
    width: 350,
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  reviewButton: {
    width: 350,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
});
