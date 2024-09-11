import { ThemedText } from "./ThemedText";
import { ThemedTextInput } from "./ThemedTextInput";
import { ThemedView } from "./ThemedView";
import { StyleSheet } from "react-native";

export type NamedFieldProps = {
  name: string;
  fieldContent: string;
  setFieldContent: (content: string) => void;
};

export function NamedField({
  name,
  fieldContent,
  setFieldContent,
}: NamedFieldProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>{name}</ThemedText>
      <ThemedTextInput
        value={fieldContent}
        onChangeText={setFieldContent}
        style={styles.textInput}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },
  text: {
    width: "95%",
    padding: 5,
  },
  textInput: {
    width: "95%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "gray",
  },
});
