import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

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
  const borderColor = useThemeColor({}, "text");

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor, borderWidth: disabled ? 0 : 1 }]}
      onPress={disabled ? () => {} : onPress}
      activeOpacity={0.8}
    >
      <ThemedText style={styles.text}>{disabled ? "" : title}</ThemedText>
    </TouchableOpacity>
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
