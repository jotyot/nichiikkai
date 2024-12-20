import ThemedView from "../themed/ThemedView";
import ThemedText from "../themed/ThemedText";
import { StyleSheet } from "react-native";

export type SearchButtonProps = {
  onPress: () => void;
};

export default function SearchButton({ onPress }: SearchButtonProps) {
  return (
    <ThemedView style={styles.container} onTouchEnd={onPress}>
      <ThemedText style={styles.text}>Search</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    width: 350,
    backgroundColor: "salmon",
  },
  text: {
    fontSize: 15,
    textAlign: "center",
    width: "100%",
    fontWeight: "bold",
  },
});
