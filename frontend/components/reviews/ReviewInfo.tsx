import { WordData } from "@/types/Types";
import { ThemedText } from "../themed/ThemedText";
import { ThemedView } from "../themed/ThemedView";
import { Collapsible } from "../Collapsible";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedIonicons } from "../themed/ThemedIonicons";

export type ReviewInfoProps = {
  wordData: WordData | undefined;
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
};

export function ReviewInfo({ wordData, hidden, setHidden }: ReviewInfoProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.info, { height: hidden ? 40 : 200 }]}>
        <ThemedIonicons
          style={styles.icon}
          name={hidden ? "eye-off" : "eye"}
          size={24}
          onPress={() => setHidden(!hidden)}
        />
        {!hidden && (
          <ThemedView style={styles.textContainer}>
            <ThemedText style={styles.text}>
              {"Meanings:   " + wordData?.meanings.join(", ")}
            </ThemedText>
            <ThemedText style={styles.text}>
              {"Word Type:  " + wordData?.partsOfSpeech.join(", ")}
            </ThemedText>
            <ThemedText style={styles.text}>
              {"Readings:   " + wordData?.readings.join(", ")}
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
  // return wordData ? (
  //   <ThemedView>
  //     <Collapsible title="Meaning">
  //       <ThemedText>{wordData.meanings.join(", ")}</ThemedText>
  //       <ThemedText>Word Type</ThemedText>
  //       {wordData.partsOfSpeech.map((part, index) => (
  //         <ThemedText key={index}>{part}</ThemedText>
  //       ))}
  //     </Collapsible>

  //     <Collapsible title="Reading">
  //       {wordData.readings.map((reading, index) => (
  //         <ThemedText key={index}>{reading}</ThemedText>
  //       ))}
  //     </Collapsible>
  //   </ThemedView>
  // ) : (
  //   <ThemedText>Loading...</ThemedText>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  info: {
    width: 300,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  icon: {
    top: 5,
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