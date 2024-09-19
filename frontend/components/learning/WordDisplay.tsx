import { WordData } from "@/types/Types";
import { StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "../themed/ThemedText";
import { ThemedView } from "../themed/ThemedView";

export type WordDisplayProps = {
  word: WordData | null;
};

export function WordDisplay({ word }: WordDisplayProps) {
  return word ? LoadedWord(word) : <ThemedText>Loading...</ThemedText>;
}

function LoadedWord(word: WordData) {
  const width = Math.min(Dimensions.get("window").width, 600);

  const wordFontSize = Math.min(200, (width / word.wordBase.word.length) * 0.8);
  const readingFontSize = Math.min(
    100,
    (width / word.wordBase.reading.length) * 0.4
  );
  const meaningFontSize = Math.max(
    Math.min(readingFontSize, (width / word.meanings[0].length) * 1.8),
    15
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText
        style={[styles.text, { fontSize: wordFontSize }]}
        type="subtitle"
      >
        {word.wordBase.word}
      </ThemedText>
      <ThemedText
        style={[styles.text, { fontSize: readingFontSize }]}
        type="subtitle"
      >
        {word.wordBase.reading}
      </ThemedText>
      <ThemedText
        style={[styles.meaningText, { fontSize: meaningFontSize }]}
        type="subtitle"
      >
        {word.meanings[0]}
      </ThemedText>
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
  meaningText: {
    textAlign: "center",
    marginVertical: 7,
  },
});
