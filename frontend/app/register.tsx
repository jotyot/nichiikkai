import { StyleSheet } from "react-native";
import { Link } from "expo-router";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import { useState } from "react";
import { NamedField } from "@/components/logins/NamedField";
import { WideButton } from "@/components/logins/WideButton";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    // await setLoginInfo(username, password);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text} type="title">
        Sign up
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
      <NamedField
        name="Confirm Password"
        fieldContent={confirmPassword}
        setFieldContent={setConfirmPassword}
      />
      <WideButton text="Sign up" onPress={handleRegister} />
      <ThemedText>
        Already have an account?{" "}
        <Link href="/login">
          <ThemedText style={{ color: "blue" }}>Sign in</ThemedText>
        </Link>
      </ThemedText>
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
