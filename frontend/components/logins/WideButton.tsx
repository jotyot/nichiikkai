import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "../themed/ThemedText";

export type WideButtonProps = {
  text: string;
  onPress: () => void;
  inactive?: boolean;
};

export function WideButton({
  text,
  onPress,
  inactive = false,
}: WideButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { opacity: inactive ? 0.5 : 1 }]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={inactive}
    >
      <ThemedText style={styles.text}>{text}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "90%",
    padding: 10,
    alignItems: "center",
    backgroundColor: "blue",
    borderRadius: 10,
    marginVertical: 20,
  },
  text: {},
});
