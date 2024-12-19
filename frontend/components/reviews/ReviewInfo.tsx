import { WordData } from "@/types/Types";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { StyleSheet, View } from "react-native";
import ThemedIonicons from "../themed/ThemedIonicons";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ReviewInfoProps = {
  disabled?: boolean;
  wordData: WordData | undefined;
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
  onSubmit: () => void;
};

export default function ReviewInfo({
  disabled = false,
  wordData,
  hidden,
  setHidden,
  onSubmit,
}: ReviewInfoProps) {
  const borderColor = "white";

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        style={[
          styles.info,
          { height: hidden ? 40 : 200, borderColor: borderColor },
        ]}
      >
        <ThemedView
          style={styles.hideButton}
          onTouchEnd={disabled ? () => {} : () => setHidden(!hidden)}
        >
          <ThemedIonicons
            style={styles.icon}
            name={disabled ? "lock-closed" : hidden ? "eye-off" : "eye"}
            size={24}
          />
        </ThemedView>

        {!hidden && (
          <ThemedView style={styles.textContainer}>
            <ThemedText style={styles.text}>
              {"JLPT Level:   " + wordData?.wordBase.jlptLevel}
            </ThemedText>
            <ThemedText style={styles.text}>
              {"Meanings:   " + wordData?.meanings.join(", ")}
            </ThemedText>
            <ThemedText style={styles.text}>
              {"Word Type:   " + wordData?.partsOfSpeech.join(", ")}
            </ThemedText>
            <ThemedText style={styles.text}>
              {"Readings:   " + wordData?.readings.join(", ")}
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
      <ThemedView style={[styles.submitButton, { borderColor: borderColor }]}>
        <ThemedIonicons name="chevron-forward" size={24} onPress={onSubmit} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: "row",
  },
  submitButton: {
    width: 45,
    height: 40,
    marginLeft: 5,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    width: 300,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
  },
  hideButton: {
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
  },
  icon: {
    top: 6,
  },
  textContainer: {
    padding: 10,
    width: "100%",
  },
  text: {
    paddingVertical: 2,
    fontSize: 16,
  },
});
