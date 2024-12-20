import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { StyleSheet } from "react-native";

export type FilterButtonProps = {
  onPress: () => void;
  title: string;
  value: string;
  width?: number;
};

export default function FilterButton({
  onPress,
  title,
  value,
  width,
}: FilterButtonProps) {
  return (
    <ThemedView style={[styles.container, { width }]} onTouchEnd={onPress}>
      <ThemedText style={styles.text}>{title + value}</ThemedText>
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
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    width: "100%",
  },
});
