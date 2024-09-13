import { StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import { useState } from "react";
import {
  getAccessTokenResponse,
  setAccessTokenResponse,
  setLoginInfo,
} from "@/storage/Storage";
import { NamedField } from "@/components/logins/NamedField";
import { WideButton } from "@/components/logins/WideButton";
import { PasswordInput } from "@/components/logins/PasswordInput";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://backend-image-952837685482.us-central1.run.app/identity/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: username, password: password }),
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        await Promise.all([
          setLoginInfo(username, password),
          setAccessTokenResponse(data),
        ]);
        router.replace("/(tabs)");
      } else {
        console.log("Login failed)");
      }
    } catch (e) {
      console.log(e);
    }
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
        canHide
      />
      <WideButton text="Sign in" onPress={handleLogin} />
      <ThemedText>
        Don't have an account?{" "}
        <Link href="/register">
          <ThemedText style={{ color: "blue" }}>Sign up</ThemedText>
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
