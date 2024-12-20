import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import {
  levelWidth,
  wordWidth,
  readingWidth,
  meaningWidth,
  rankWidth,
} from "./ColumnWidths";
import { StyleSheet } from "react-native";

export default function DictionaryLabel() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={[styles.text, styles.level]}>N?</ThemedText>
      <ThemedText style={[styles.text, styles.word]}>Word</ThemedText>
      <ThemedText style={[styles.text, styles.reading]}>Reading</ThemedText>
      <ThemedText style={[styles.text, styles.meaning]}>Meaning</ThemedText>
      <ThemedText style={[styles.text, styles.rank]}>Frequency Rank</ThemedText>
    </ThemedView>
  );
}

const rankLabelWidth = 93;

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
  meaning: {
    width: meaningWidth + rankWidth - rankLabelWidth,
  },
  rank: {
    width: rankLabelWidth,
    textAlign: "right",
  },
});
