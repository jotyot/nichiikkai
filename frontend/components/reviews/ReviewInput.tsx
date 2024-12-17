import { ThemedTextInput } from "../themed/ThemedTextInput";
import { StyleSheet } from "react-native";
import { useState } from "react";
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
      const kana = toKana(text);
      setInput(kana);
    } else {
      setInput(text);
    }
  };

  return (
    <ThemedTextInput
      value={input}
      onChangeText={handleTextChange}
      style={styles.textInput}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    textAlign: "center",
    width: "100%",
    paddingVertical: 10,
    borderColor: "gray",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    fontSize: 20,
    height: 50,
  },
});
