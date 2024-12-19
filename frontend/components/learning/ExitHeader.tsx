import ThemedIonicons from "../themed/ThemedIonicons";
import ThemedView from "../themed/ThemedView";
import { StyleSheet } from "react-native";

export type ExitHeaderProps = {
  handleExit: () => Promise<void> | void;
};

export default function ExitHeader({ handleExit }: ExitHeaderProps) {
  return (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.exitButton} onTouchEnd={handleExit}>
        <ThemedIonicons name="close" size={25} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 50,
    backgroundColor: "black",
    zIndex: 1,
  },
  exitButton: {
    position: "absolute",
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});
