import { StyleSheet, Switch } from "react-native";
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
    <ThemedView style={styles.container} onTouchEnd={() => onChange(!on)}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedIonicons
        name={on ? "checkbox-outline" : "square-outline"}
        size={24}
      />
    </ThemedView>
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
