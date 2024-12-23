import ThemedTextInput from "../themed/ThemedTextInput";
import ThemedView from "../themed/ThemedView";
import { StyleSheet } from "react-native";
import { forwardRef, Ref, useRef, useState } from "react";
import { toKana } from "wanakana";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TextInput } from "react-native-gesture-handler";

export type ReviewInputProps = {
  input: string;
  setInput: (input: string) => void;
  onSubmit: () => void;
  type?: "reading" | "meaning";
  state: "correct" | "incorrect" | "default";
};

const ReviewInput = forwardRef(
  (
    {
      input,
      setInput,
      onSubmit,
      type = "meaning",
      state = "default",
    }: ReviewInputProps,
    ref: Ref<TextInput>
  ) => {
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
        editable={state === "default" || state === "correct"}
        value={input}
        onChangeText={handleTextChange}
        onSubmitEditing={onSubmit}
        style={[
          styles.textInput,
          {
            backgroundColor:
              state === "default"
                ? useThemeColor({}, "background")
                : state === "correct"
                ? "seagreen"
                : "lightcoral",
          },
        ]}
        ref={ref}
      />
    );
  }
);

export default ReviewInput;

const styles = StyleSheet.create({
  textInput: {
    textAlign: "center",
    width: 350,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 20,
    height: 50,
  },
});
