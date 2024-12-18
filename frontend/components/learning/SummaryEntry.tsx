import ThemedView from "../themed/ThemedView";
import ThemedText from "../themed/ThemedText";
import { StyleSheet } from "react-native";
import { ToWordPair } from "@/functions/Reviewer";

export type SummaryEntryProps = {
  key: number;
  correct: boolean;
  wordPair: string;
};

export default function SummaryEntry({
  key,
  correct,
  wordPair,
}: SummaryEntryProps) {
  const { word, reading } = ToWordPair(wordPair);

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: correct ? "seagreen" : "lightcoral" },
      ]}
      key={key}
    >
      <ThemedText style={styles.text}>
        {word} ({reading})
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    margin: 3,
    padding: 10,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
  },
  text: {
    fontSize: 15,
  },
});
