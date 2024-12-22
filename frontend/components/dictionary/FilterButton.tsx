import { useThemeColor } from "@/hooks/useThemeColor";
import ThemedText from "../themed/ThemedText";
import { StyleSheet, TouchableOpacity } from "react-native";

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
  const borderColor = useThemeColor({}, "text");

  return (
    <TouchableOpacity
      style={[styles.container, { width, borderColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ThemedText style={styles.text}>{title + value}</ThemedText>
    </TouchableOpacity>
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
