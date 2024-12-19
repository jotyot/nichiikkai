import { router } from "expo-router";
import ThemedIonicons from "../themed/ThemedIonicons";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { StyleSheet } from "react-native";
import SummaryEntry from "./SummaryEntry";

export type SummaryProps = {
  correctSet: Set<string>;
  incorrectSet: Set<string>;
  mode: "learn" | "review";
  lock: boolean;
};

export default function Summary({
  correctSet,
  incorrectSet,
  mode,
  lock,
}: SummaryProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.summaryText} type="title">
        Summary
      </ThemedText>
      <ThemedText style={styles.subtitle}>You were 大丈夫 on these!</ThemedText>
      <ThemedView style={styles.entryContainer}>
        {Array.from(correctSet).map((word, index) => (
          <SummaryEntry key={index} correct wordPair={word} />
        ))}
      </ThemedView>
      {mode === "review" && (
        <ThemedText style={styles.subtitle}>
          You messed up a bit on these
        </ThemedText>
      )}
      <ThemedView style={styles.entryContainer}>
        {Array.from(incorrectSet).map((word, index) => (
          <SummaryEntry key={index} correct={false} wordPair={word} />
        ))}
      </ThemedView>
      <ThemedView
        style={styles.exitButton}
        onTouchEnd={
          lock
            ? () => {}
            : () =>
                router.replace(mode === "learn" ? "/(tabs)" : "/(tabs)/review")
        }
      >
        <ThemedIonicons name={lock ? "lock-closed" : "close"} size={30} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryText: {
    fontSize: 40,
    position: "absolute",
    top: 50,
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 10,
  },
  entryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  exitButton: {
    position: "absolute",
    bottom: 50,
    width: 150,
    height: 50,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});
