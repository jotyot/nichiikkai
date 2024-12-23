import ThemedView from "../themed/ThemedView";
import ThemedText from "../themed/ThemedText";
import { StyleSheet } from "react-native";

export default function Title() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.jpText}>日一回</ThemedText>
      <ThemedText style={styles.text}>Nichiikkai</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
  },
  text: {
    fontSize: 60,
    fontWeight: "bold",
  },
  jpText: {
    fontSize: 40,
    fontWeight: "bold",
  },
});
