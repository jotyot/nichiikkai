import { StyleSheet, Switch, TouchableOpacity } from "react-native";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import ThemedIonicons from "../themed/ThemedIonicons";

export type CheckBoxProps = {
  label: string;
  on: boolean;
  onChange: (value: boolean) => void;
};

export default function CheckBox({ label, on, onChange }: CheckBoxProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onChange(!on)}
      activeOpacity={0.8}
    >
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedIonicons
        name={on ? "checkbox-outline" : "square-outline"}
        size={24}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    marginEnd: 3,
  },
});
