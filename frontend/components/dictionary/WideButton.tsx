import { useThemeColor } from "@/hooks/useThemeColor";
import ThemedText from "../themed/ThemedText";
import { StyleSheet, TouchableOpacity } from "react-native";
import { TouchableOpacityProps } from "react-native-gesture-handler";

export type WideButtonProps = TouchableOpacityProps & {
  text: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function WideButton({
  text,
  onPress,
  disabled,
  style,
}: WideButtonProps) {
  const borderColor = useThemeColor({}, "text");
  return (
    <TouchableOpacity
      style={[
        styles.container,
        style,
        { borderColor, opacity: disabled ? 0.5 : 1 },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <ThemedText style={styles.text}>{text}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    width: 350,
    backgroundColor: "salmon",
    margin: 5,
  },
  text: {
    fontSize: 15,
    textAlign: "center",
    width: "100%",
    fontWeight: "bold",
  },
});
