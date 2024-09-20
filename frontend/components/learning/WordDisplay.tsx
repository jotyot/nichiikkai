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
    (width / word.wordBase.reading.length) * 0.3
  );
  

  return (
    <ThemedView style={styles.container}>
      <ThemedText
        style={[styles.readingText, { fontSize: readingFontSize }]}
      >
        {word.wordBase.reading}
      </ThemedText>
      <ThemedText
        style={[styles.titleText, { fontSize: wordFontSize }]}
        type="subtitle"
      >
        {word.wordBase.word}
      </ThemedText>
      <ThemedText
        style={styles.partsOfSpeechText}
      >
        {word.partsOfSpeech.join(", ")}
      </ThemedText>
      <ThemedText
        style={styles.meaningText}
        type="subtitle"
      >
        {word.meanings.join(", ")}
      </ThemedText>
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  titleText: {
    textAlign: "center",
  },
  readingText: {
    textAlign: "center",
    marginVertical: -40,
  },
  partsOfSpeechText: {
    textAlign: "left",
    fontSize: 25
  },
  meaningText: {
    textAlign: "left",
    fontSize: 40,
    marginVertical: 10
  },
});
