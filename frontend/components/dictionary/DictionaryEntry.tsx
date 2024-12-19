import { WordBase } from "@/types/Types";
import { StyleSheet } from "react-native";
import ThemedView from "../themed/ThemedView";
import ThemedText from "../themed/ThemedText";

export type DictonaryEntryProps = {
  wordBase: WordBase;
};

export default function DictionaryEntry({ wordBase }: DictonaryEntryProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>{wordBase.jlptLevel}</ThemedText>
      <ThemedText style={styles.text}>{wordBase.word}</ThemedText>
      <ThemedText style={styles.text}>{wordBase.reading}</ThemedText>
      <ThemedText style={styles.text}>{wordBase.meaning}</ThemedText>
      <ThemedText style={styles.text}>{wordBase.frequencyRank}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  text: {
    margin: 5,
  },
});
