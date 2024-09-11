import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";

export type WideButtonProps = {
  text: string;
  onPress: () => void;
};

export function WideButton({ text, onPress }: WideButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ThemedText style={styles.text}>{text}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "95%",
    padding: 10,
    alignItems: "center",
    backgroundColor: "blue",
    borderRadius: 10,
    marginVertical: 20,
  },
  text: {},
});
