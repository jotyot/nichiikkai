import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { getReviewQueue } from "@/functions/Storage";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { Reviewer } from "@/functions/Reviewer";

export default function ReviewsScreen() {

  const reviewer = useRef<Reviewer | null>(null);

  useEffect(() => {
    (async () => {
      const reviewQueue = await getReviewQueue();
      reviewer.current = new Reviewer(reviewQueue);
    })();
  }, []);
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text} type="title">
        Reviews
      </ThemedText>
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
