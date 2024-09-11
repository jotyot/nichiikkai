import { StyleSheet } from "react-native";
import { Link } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { setLoginInfo } from "@/storage/Storage";
import { NamedField } from "@/components/NamedField";
import { WideButton } from "@/components/WideButton";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // await setLoginInfo(username, password);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text} type="title">
        Sign in
      </ThemedText>
      <NamedField
        name="Email"
        fieldContent={username}
        setFieldContent={setUsername}
      />
      <NamedField
        name="Password"
        fieldContent={password}
        setFieldContent={setPassword}
      />
      <WideButton text="Sign in" onPress={handleLogin} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  text: {
    fontSize: 24,
    marginVertical: 20,
  },
});
