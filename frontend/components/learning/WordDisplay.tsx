import { WordBase } from "@/types/Types";
import { StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "../themed/ThemedText";
import { ThemedView } from "../themed/ThemedView";
import { useEffect, useState } from "react";

export type WordDisplayProps = {
  word: WordBase | null;
};

export function WordDisplay({ word }: WordDisplayProps) {
  return word ? LoadedWord(word) : <ThemedText>Loading...</ThemedText>;
}

function LoadedWord(sword: WordBase) {
  const width = Math.min(Dimensions.get("window").width, 600);
  const word = {
    word: "押さえる",
    reading: "おさえる",
    meaning:
      "to pin down, to hold down, to press down, to hold in place, to hold steady to cover (esp. a part of one's body with one's hand), to clutch (a body part in pain), to press (a body part) to get a hold of, to obtain, to seize, to catch, to arrest",
  };

  word.meaning = word.meaning.slice(0, 40) + "...";

  const wordFontSize = Math.min(200, (width / word.word.length) * 0.8);
  const readingFontSize = Math.min(100, (width / word.reading.length) * 0.4);
  const meaningFontSize = Math.max(
    Math.min(readingFontSize, (width / word.meaning.length) * 1.8),
    15
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText
        style={[styles.text, { fontSize: wordFontSize }]}
        type="subtitle"
      >
        {word.word}
      </ThemedText>
      <ThemedText
        style={[styles.text, { fontSize: readingFontSize }]}
        type="subtitle"
      >
        {word.reading}
      </ThemedText>
      <ThemedText
        style={[styles.meaningText, { fontSize: meaningFontSize }]}
        type="subtitle"
      >
        {word.meaning}
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
