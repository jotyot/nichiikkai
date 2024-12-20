import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { StyleSheet } from "react-native";

export type PageButtonProps = {
  onPress: () => void;
  title: string;
  disabled?: boolean;
};

export default function PageButton({
  onPress,
  title,
  disabled = false,
}: PageButtonProps) {
  return (
    <ThemedView
      style={[styles.container, { borderWidth: disabled ? 0 : 1 }]}
      onTouchEnd={disabled ? () => {} : onPress}
    >
      <ThemedText style={styles.text}>{disabled ? "" : title}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 10,
    padding: 5,
    width: 100,
  },
  text: {
    fontSize: 15,
    textAlign: "center",
  },
});
