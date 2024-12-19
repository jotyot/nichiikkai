import { StyleSheet, Switch } from "react-native";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";

export type CheckBoxProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function CheckBox({ value, onChange }: CheckBoxProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Show all levels</ThemedText>
      <Switch value={value} onValueChange={onChange} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
});
