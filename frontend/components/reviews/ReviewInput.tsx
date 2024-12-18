import { ThemedTextInput } from "../themed/ThemedTextInput";
import { StyleSheet } from "react-native";
import { useRef, useState } from "react";
import { toKana } from "wanakana";

export type ReviewInputProps = {
  input: string;
  setInput: (input: string) => void;
  onSubmit: () => void;
  type?: "reading" | "meaning";
};

export function ReviewInput({
  input,
  setInput,
  onSubmit,
  type = "meaning",
}: ReviewInputProps) {
  const handleTextChange = (text: string) => {
    if (type === "reading") {
      const kana = toKana(text, {
        IMEMode: true,
        customKanaMapping: { n: "n" },
      });
      setInput(kana);
    } else {
      setInput(text);
    }
  };

  return (
    <ThemedTextInput
      value={input}
      onChangeText={handleTextChange}
      onSubmitEditing={onSubmit}
      style={styles.textInput}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    textAlign: "center",
    width: 300,
    paddingVertical: 10,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 20,
    height: 50,
  },
});
