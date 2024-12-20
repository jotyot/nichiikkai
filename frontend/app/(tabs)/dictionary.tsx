import ThemedView from "@/components/themed/ThemedView";
import { useEffect, useState, memo } from "react";
import { GetUserLevels } from "@/functions/Storage";
import { StyleSheet, SafeAreaView, VirtualizedList } from "react-native";
import CheckBox from "@/components/dictionary/Checkbox";
import { GETWords } from "@/functions/APICalls";
import { WordBase } from "@/types/Types";
import DictionaryEntry from "@/components/dictionary/DictionaryEntry";
import DictionaryLabel from "@/components/dictionary/DictionaryLabel";

export default function Dictionary() {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [words, setWords] = useState<WordBase[]>([]);

  useEffect(() => {
    (async () => {
      const userLevels = await GetUserLevels();
      setSelectedLevels(userLevels);
      const words = await GETWords(userLevels);
      setWords(words);
    })();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.levelContainer}>
        {["N1", "N2", "N3", "N4", "N5"].map((level, i) => (
          <CheckBox
            key={i}
            label={level}
            on={selectedLevels.includes(level)}
            onChange={(value) => {
              setSelectedLevels((prev) =>
                value
                  ? [...prev, level]
                  : prev.filter((selected) => selected !== level)
              );
            }}
          />
        ))}
      </ThemedView>
      <DictionaryLabel />
      <SafeAreaView style={styles.wordContainer}>
        <VirtualizedList
          data={words}
          initialNumToRender={20}
          renderItem={({ item }) => <OptimizedEntry wordBase={item} />}
          keyExtractor={(item: WordBase) => item.word}
          getItemCount={() => words.length}
          getItem={(data, index) => data[index]}
        ></VirtualizedList>
      </SafeAreaView>
    </ThemedView>
  );
}

const OptimizedEntry = memo(DictionaryEntry);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    margin: 10,
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    width: 350,
  },
  wordContainer: {
    height: 500,
  },
});
