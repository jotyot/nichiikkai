import { ThemedText } from "../themed/ThemedText";
import { ThemedTextInput } from "../themed/ThemedTextInput";
import { ThemedView } from "../themed/ThemedView";
import { StyleSheet } from "react-native";
import { PasswordInput } from "./PasswordInput";

export type NamedFieldProps = {
  name: string;
  fieldContent: string;
  setFieldContent: (content: string) => void;
  canHide?: boolean;
};

export function NamedField({
  name,
  fieldContent,
  setFieldContent,
  canHide = false,
}: NamedFieldProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>{name}</ThemedText>
      {canHide ? (
        <PasswordInput
          password={fieldContent}
          setPassword={setFieldContent}
          style={styles.textInput}
        ></PasswordInput>
      ) : (
        <ThemedTextInput
          value={fieldContent}
          onChangeText={setFieldContent}
          style={styles.textInput}
        />
      )}
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
