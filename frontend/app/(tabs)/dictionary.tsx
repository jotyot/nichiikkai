import ThemedView from "@/components/themed/ThemedView";
import { useEffect, useState } from "react";
import { GetUserLevels } from "@/functions/Storage";
import { StyleSheet } from "react-native";
import CheckBox from "@/components/dictionary/Checkbox";
import { GETWords } from "@/functions/APICalls";
import { WordBase } from "@/types/Types";
import DictionaryEntry from "@/components/dictionary/DictionaryEntry";

export default function Dictionary() {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [word, setWord] = useState<WordBase | null>(null);

  useEffect(() => {
    (async () => {
      const userLevels = await GetUserLevels();
      setSelectedLevels(userLevels);
      const word: WordBase = {
        frequencyRank: 17993,
        id: 3249,
        jlptLevel: "N2",
        meaning: "place of origin",
        reading: "げんさん",
        word: "原産",
      };
      setWord(word);
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
      {word && <DictionaryEntry wordBase={word} />}
    </ThemedView>
  );
}

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
});
