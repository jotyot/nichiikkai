import { router } from "expo-router";
import ReviewsScreen from "@/components/reviews/ReviewsScreen";

export default function Reviews() {
  return <ReviewsScreen handleExit={ExitReviews} />;
}

export async function ExitReviews() {
  router.replace("/(tabs)");
}
