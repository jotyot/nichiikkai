import { View, ViewProps, StyleSheet, TextStyle } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  text?: string;
  textStyle?: TextStyle;
};

export function ThemedLineDivider({
  style,
  lightColor,
  darkColor,
  text,
  textStyle,
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const borderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );

  return (
    <ThemedView style={[styles.container, style]}>
      <ThemedText
        style={[
          styles.text,
          textStyle,
          { backgroundColor },
          {
            paddingHorizontal: text ? 10 : 0,
          },
        ]}
      >
        {text}
      </ThemedText>
      <View
        style={[
          styles.line,
          { backgroundColor },
          { borderBottomColor: borderColor, borderBottomWidth: 1 },
        ]}
      ></View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    width: "100%",
    position: "absolute",
  },
  text: {
    zIndex: 1,
  },
});
