import { StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import { useState } from "react";
import { SetAccessTokenResponse, SetLoginInfo } from "@/functions/Storage";
import { NamedField } from "@/components/logins/NamedField";
import { WideButton } from "@/components/logins/WideButton";
import { POSTLogin } from "@/functions/APICalls";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signinFailed, setSigninFailed] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const handleSignin = async () => {
    try {
      setSigningIn(true);
      const response = await POSTLogin(username, password);
      await Promise.all([
        SetLoginInfo(username, password),
        SetAccessTokenResponse(response),
      ]);
      router.replace("/fetching-data");
    } catch (e) {
      console.log(e);
      setSigninFailed(true);
    } finally {
      setSigningIn(false);
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
      {signinFailed && (
        <ThemedText style={{ color: "red" }}>
          Incorrect email or password.
        </ThemedText>
      )}
      <WideButton text="Sign in" onPress={handleSignin} inactive={signingIn} />
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
