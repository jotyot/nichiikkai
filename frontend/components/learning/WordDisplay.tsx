import { WordData } from "@/types/Types";
import { StyleSheet, Dimensions, SafeAreaView, ScrollView, StatusBar } from "react-native";
import { ThemedText } from "../themed/ThemedText";
import { ThemedView } from "../themed/ThemedView";
import { ThemedLineDivider } from "../themed/ThemedLineDivider";

export type WordDisplayProps = {
  word: WordData | null;
};

export function WordDisplay({ word }: WordDisplayProps) {
  return word ? (
    LoadedWord(word)
  ) : (
    <ThemedText style={styles.loadingText}>Loading...</ThemedText>
  );
}

function LoadedWord(word: WordData) {
  const width = Math.min(Dimensions.get("window").width, 600);
  const height = Dimensions.get("window").height;

  const wordFontSize = Math.min(200, (width / word.wordBase.word.length) * 0.8);
  const readingFontSize = Math.min(
    100,
    (width / word.wordBase.reading.length) * 0.3
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.content}>
          <ThemedView style={{ height: 50 }} />
          <ThemedLineDivider
            style={styles.divider}
            text={word.wordBase.jlptLevel}
            textStyle={styles.dividerText}
          />
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
          <ThemedText style={styles.partsOfSpeechText}>
            {word.partsOfSpeech.join(", ")}
          </ThemedText>
          <ThemedText style={styles.meaningText} type="subtitle">
            {word.meanings.join(", ")}
          </ThemedText>
          <ThemedLineDivider style={styles.divider} />
          {word.sentences &&
            word.sentences.map((sentence, index) => {
              return (
                <ThemedView key={index}>
                  <ThemedText key={index} style={styles.sentenceText}>
                    {sentence.japanese}
                  </ThemedText>
                  <ThemedText key={index + "a"} style={styles.translationText}>
                    {sentence.english}
                  </ThemedText>
                </ThemedView>
              );
            })}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 24,
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    width: "100%",
  },
  scrollView: {
    marginHorizontal: 0,
  },
  content: {
    marginHorizontal: 30,
  },
  readingText: {
    textAlign: "center",
    marginBottom: -40,
  },
  titleText: {
    textAlign: "center",
  },
  partsOfSpeechText: {
    textAlign: "left",
    fontSize: 25,
  },
  meaningText: {
    textAlign: "left",
    fontSize: 40,
    marginTop: 10,
  },
  sentenceText: {
    textAlign: "left",
    fontSize: 25,
  },
  translationText: {
    textAlign: "left",
    fontSize: 15,
    marginBottom: 20,
  },
  divider: {
    marginVertical: 50,
  },
  dividerText: {
    fontSize: 20,
  },
});
