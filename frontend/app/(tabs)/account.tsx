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
      <ThemedView style={styles.levelContainer}>
        {["N1", "N2", "N3", "N4", "N5"].map((level, i) => (
          <CheckBox
            key={i}
            label={level}
            on={selectedLevels.includes(level)}
            onChange={(value) => {
              setSelectedLevels((prev) =>
                value
                  ? [...prev, level]
                  : prev.filter((selected) => selected !== level)
              );
              setShowUpdated(false);
            }}
          />
        ))}
      </ThemedView>
      {showUpdated && <ThemedText>Levels updated!</ThemedText>}
      <WideButton
        text="Update"
        onPress={handleLevelUpdate}
        disabled={updateButtonDisabled}
      />
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
  levelContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    width: 350,
    margin: 5,
  },
  text: {
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "blue",
  },
});
