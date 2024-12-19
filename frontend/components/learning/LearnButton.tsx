import { TouchableOpacity, StyleSheet } from "react-native";
import ThemedText from "../themed/ThemedText";

export type LearnButtonProps = {
  disabled?: boolean;
  onPress: () => void;
};

export function LearnButton({ onPress, disabled }: LearnButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: disabled ? "gray" : "salmon" }]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <ThemedText style={styles.text}>Learn</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    width: 120,
    height: 120,
    padding: 10,
    bottom: 20,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 1,
  },
  text: {},
});
