import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { StyleSheet } from "react-native";

export default function EmptyDictionary() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>Loading...</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 370,
    height: 500,
  },
  text: {
    fontSize: 20,
  },
});
