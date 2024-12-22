import ThemedView from "../themed/ThemedView";
import CheckBox from "./Checkbox";
import { StyleSheet } from "react-native";

export type LevelSelectionProps = {
  selectedLevels: string[];
  setSelectedLevels: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function LevelSelection({
  selectedLevels,
  setSelectedLevels,
}: LevelSelectionProps) {
  return (
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
  );
}

const styles = StyleSheet.create({
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    width: 350,
    margin: 5,
  },
});
