import ThemedText from "@/components/themed/ThemedText";
import ThemedView from "@/components/themed/ThemedView";
import { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Reviewer, ToWordPair } from "@/functions/Reviewer";
import { WordData } from "@/types/Types";
import ReviewInput from "@/components/reviews/ReviewInput";
import { GETWordData } from "@/functions/APICalls";
import ReviewInfo from "@/components/reviews/ReviewInfo";
import { FuzzyMatch } from "@/functions/FuzzyMatch";
import { isKana } from "wanakana";

export type ReviewsScreenProps = {
  reviewer: React.MutableRefObject<Reviewer | undefined>;
  handleExit: () => Promise<void> | void;
};

export default function ReviewsScreen({
  handleExit,
  reviewer,
}: ReviewsScreenProps) {
  const wordDataMap = useRef<Map<string, WordData>>(new Map());

  const [displayWord, setDisplayWord] = useState<string | undefined>(undefined);
  const [reviewType, setReviewType] = useState<"reading" | "meaning">(
    "reading"
  );

  const [currentWordData, setCurrentWordData] = useState<
    WordData | undefined
  >();

  const [userInput, setUserInput] = useState<string>("");
  const [infoHidden, setInfoHidden] = useState<boolean>(true);
  const [answerState, setAnswerState] = useState<
    "correct" | "incorrect" | "default"
  >("default");

  useEffect(() => {
    (async () => {
      if (!reviewer.current) throw new Error("No reviewer");

      const { wordPair } = reviewer.current.GetCurrentReviewEntry();
      if (!wordPair) throw new Error("No words to review");
      const wordData = await GETWordData(ToWordPair(wordPair));
      wordDataMap.current.set(wordPair, wordData);

      await displayNextReview();
    })();
  }, []);

  const displayNextReview = async () => {
    if (!reviewer.current) throw new Error("No reviewer");

    setUserInput("");
    setInfoHidden(true);
    setAnswerState("default");
    const { wordPair, type } = reviewer.current.GetCurrentReviewEntry();

    if (!wordPair) {
      await handleExit();
      return;
    }

    const word = wordPair?.split("@")[0];
    setDisplayWord(word);
    setReviewType(type);
    if (wordPair) {
      const wordData = wordDataMap.current.get(wordPair);
      if (wordData)
        wordData.meanings = [...wordData.meanings, wordData.wordBase.meaning];
      setCurrentWordData(wordData);
    }
    await loadNextWordData();
  };

  const loadNextWordData = async () => {
    if (!reviewer.current) throw new Error("No reviewer");

    const nextWordPair = reviewer.current.GetNextReviewEntry();
    if (nextWordPair) {
      const wordData = await GETWordData(ToWordPair(nextWordPair));
      wordDataMap.current.set(nextWordPair, wordData);
    }
  };

  const checkAnswer = (): boolean => {
    if (currentWordData === undefined) throw new Error("No word data");
    if (reviewType === "reading") {
      return currentWordData.readings.includes(userInput);
    }

    return FuzzyMatch(userInput, currentWordData.meanings);
  };

  const handleSubmit = async () => {
    if (!reviewer.current) throw new Error("No reviewer");

    if (userInput === "") return;
    if (reviewType === "reading" && !isKana(userInput)) return;

    const correct = checkAnswer();
    setAnswerState(correct ? "correct" : "incorrect");
    reviewer.current.GiveAnswer(correct);

    if (correct) {
      await new Promise((r) => setTimeout(r, 500));
      await displayNextReview();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.filler} />
      <ThemedText style={styles.wordText} type="title">
        {displayWord ?? "..."}
      </ThemedText>
      <ThemedText style={styles.typeText} type="subtitle">
        {reviewType === "reading" ? "Reading" : "Meaning"}
      </ThemedText>
      <ReviewInput
        input={userInput}
        setInput={setUserInput}
        onSubmit={handleSubmit}
        type={reviewType}
        state={answerState}
      />
      <ReviewInfo
        wordData={currentWordData}
        hidden={infoHidden}
        setHidden={setInfoHidden}
        onSubmit={answerState !== "default" ? displayNextReview : handleSubmit}
        disabled={answerState === "default"}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  filler: {
    height: 150,
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

