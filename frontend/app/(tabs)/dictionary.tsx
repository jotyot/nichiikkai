import ThemedView from "@/components/themed/ThemedView";
import { useEffect, useState } from "react";
import { GetUserLevels } from "@/functions/Storage";
import { StyleSheet } from "react-native";
import CheckBox from "@/components/dictionary/Checkbox";

export default function Dictionary() {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const userLevels = await GetUserLevels();
      setSelectedLevels(userLevels);
    })();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <CheckBox
        value={selectedLevels.length === 0}
        onChange={(value) =>
          setSelectedLevels(value ? [] : ["N5", "N4", "N3", "N2", "N1"])
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
