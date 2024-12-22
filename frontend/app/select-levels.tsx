import ThemedView from "@/components/themed/ThemedView";
import ThemedText from "@/components/themed/ThemedText";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import LevelSelection from "@/components/dictionary/LevelSelection";
import WideButton from "@/components/dictionary/WideButton";
import { PUTUserLevels } from "@/functions/APICalls";
import { GetAccessTokenResponse } from "@/functions/Storage";

export default function SelectLevels() {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Select levels
      </ThemedText>
      <ThemedText style={styles.text}>
        Choose the levels you want to study.
      </ThemedText>
      <LevelSelection
        selectedLevels={selectedLevels}
        setSelectedLevels={setSelectedLevels}
      />
      <WideButton
        text="Continue"
        onPress={async () => {
          const accessToken = (await GetAccessTokenResponse()).accessToken;
          await PUTUserLevels(accessToken, selectedLevels);
          router.replace("/fetching-data");
        }}
        disabled={selectedLevels.length === 0}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  title: {
    fontSize: 24,
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
});
