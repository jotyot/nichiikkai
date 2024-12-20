import { WordBase } from "@/types/Types";
import { StyleSheet } from "react-native";
import ThemedView from "../themed/ThemedView";
import ThemedText from "../themed/ThemedText";
import {
  levelWidth,
  meaningWidth,
  rankWidth,
  readingWidth,
  wordWidth,
} from "./ColumnWidths";

export type DictonaryEntryProps = {
  wordBase: WordBase;
};

export default function DictionaryEntry({ wordBase }: DictonaryEntryProps) {
  const rank = wordBase.frequencyRank;

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={[styles.text, styles.level]}>
        {wordBase.jlptLevel}
      </ThemedText>
      <ThemedText style={[styles.text, styles.word]}>
        {wordBase.word}
      </ThemedText>
      <ThemedText style={[styles.text, styles.reading]}>
        {wordBase.reading}
      </ThemedText>
      <ThemedText
        style={[
          styles.text,
          { width: rank > 0 ? meaningWidth : meaningWidth + rankWidth },
        ]}
      >
        {wordBase.meaning}
      </ThemedText>
      <ThemedText style={[styles.text, { width: rank > 0 ? rankWidth : 0 }]}>
        {wordBase.frequencyRank}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomWidth: 1,
    padding: 5,
  },
  text: {
    margin: 2,
    fontSize: 13,
  },
  level: {
    width: levelWidth,
  },
  word: {
    width: wordWidth,
  },
  reading: {
    width: readingWidth,
  },
});
