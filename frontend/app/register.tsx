import { StyleSheet } from "react-native";
import { Link } from "expo-router";
import ThemedView from "@/components/themed/ThemedView";
import ThemedText from "@/components/themed/ThemedText";
import { useEffect, useState } from "react";
import NamedField from "@/components/logins/NamedField";
import WideButton from "@/components/dictionary/WideButton";
import { router } from "expo-router";
import { POSTRegister, POSTLogin } from "@/functions/APICalls";
import { SetAccessTokenResponse, SetLoginInfo } from "@/functions/Storage";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [registerErrors, setRegisterErrors] = useState<string[]>([]);
  const [notMatching, setNotMatching] = useState(false);
  const [registering, setRegistering] = useState(false);

  const handleRegister = async () => {
    try {
      setRegistering(true);
      await POSTRegister(username.trim(), password.trim());
      const response = await POSTLogin(username.trim(), password.trim());
      await Promise.all([
        SetLoginInfo(username.trim(), password.trim()),
        SetAccessTokenResponse(response),
      ]);
      router.replace("/select-levels");
    } catch ({ message, cause }: any) {
      const errors = Object.values(cause.errors).flat() as string[];
      setRegisterErrors(errors);
    } finally {
      setRegistering(false);
    }
  };

  useEffect(() => {
    if (confirmPassword !== "" && password.trim() !== confirmPassword.trim()) {
      setNotMatching(true);
    } else {
      setNotMatching(false);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (
      username.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      !notMatching
    ) {
      setRegistering(false);
    } else {
      setRegistering(true);
    }
  }, [username, password, confirmPassword, notMatching]);

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
        canHide
      />
      <NamedField
        name="Confirm Password"
        fieldContent={confirmPassword}
        setFieldContent={setConfirmPassword}
        canHide
      />
      {notMatching && (
        <ThemedText style={styles.error}>Passwords do not match.</ThemedText>
      )}
      {registerErrors.map((error, i) => (
        <ThemedText key={i} style={styles.error}>
          {error}
        </ThemedText>
      ))}
      <WideButton
        text="Sign up"
        onPress={handleRegister}
        disabled={registering}
        style={styles.registerButton}
      />
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
  registerButton: {
    backgroundColor: "blue",
    marginTop: 40,
    marginBottom: 10,
    borderWidth: 0,
  },
  error: {
    color: "red",
    fontSize: 12,
  },
});
