import { Pressable, StyleSheet, TextInput } from "react-native";
import { Link } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { setLoginInfo } from "@/storage/Storage";
import { ThemedTextInput } from "@/components/ThemedTextInput";
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
    marginTop: 200,
  },
});
