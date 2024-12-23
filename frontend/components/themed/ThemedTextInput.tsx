import { type TextInputProps, StyleSheet, TextInput } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import React, { forwardRef, Ref } from "react";

export type ThemedTextProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

const ThemedTextInput = forwardRef(
  (
    {
      style,
      lightColor,
      darkColor,
      type = "default",
      ...rest
    }: ThemedTextProps,
    ref: Ref<TextInput>
  ) => {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    return (
      <TextInput
        style={[
          { color },
          { borderColor: color },
          type === "default" ? styles.default : undefined,
          type === "title" ? styles.title : undefined,
          type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
          type === "subtitle" ? styles.subtitle : undefined,
          type === "link" ? styles.link : undefined,
          style,
        ]}
        ref={ref}
        {...rest}
      />
    );
  }
);

export default ThemedTextInput;

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
