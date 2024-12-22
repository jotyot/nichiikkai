import ThemedText from "@/components/themed/ThemedText";
import ThemedView from "@/components/themed/ThemedView";
import { StyleSheet } from "react-native";
import WideButton from "@/components/dictionary/WideButton";
import {
  RemoveLoginInfo,
  GetAccessTokenResponse,
  SetUserLevels,
} from "@/functions/Storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import CheckBox from "@/components/dictionary/Checkbox";
import { GetUserLevels } from "@/functions/Storage";
import { GETUserLevels, PUTUserLevels } from "@/functions/APICalls";
import LevelSelection from "@/components/dictionary/LevelSelection";

export default function Account() {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [showUpdated, setShowUpdated] = useState(false);
  const [updateButtonDisabled, setUpdateButtonDisabled] = useState(false);

  useEffect(() => {
    (async () => {
      const userLevels = await GetUserLevels();
      setSelectedLevels(userLevels);
    })();
  }, []);

  const handleLevelUpdate = async () => {
    setShowUpdated(true);
    setUpdateButtonDisabled(true);
    const accessToken = (await GetAccessTokenResponse()).accessToken;
    await PUTUserLevels(accessToken, selectedLevels);
    await setTimeout(() => {}, 1000);
    const userLevels = await GETUserLevels(accessToken);
    await SetUserLevels(userLevels);
    setUpdateButtonDisabled(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>
        Change the levels you want to study.
      </ThemedText>
      <LevelSelection
        selectedLevels={selectedLevels}
        setSelectedLevels={setSelectedLevels}
      />
      {showUpdated && <ThemedText>Levels updated!</ThemedText>}
      <WideButton
        text="Update"
        onPress={handleLevelUpdate}
        disabled={updateButtonDisabled}
      />
      <ThemedView style={styles.filler} />
      <WideButton
        text="Log out"
        onPress={async () => {
          await RemoveLoginInfo();
          router.replace("/login");
        }}
        style={styles.logoutButton}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
  logoutButton: {
    borderWidth: 1,
    backgroundColor: "blue",
  },
  filler: {
    height: 200,
  },
});
