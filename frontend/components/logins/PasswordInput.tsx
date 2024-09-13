import { useState } from "react";
import { ThemedTextInput } from "../themed/ThemedTextInput";
import { TextInputProps, View, StyleSheet } from "react-native";
import { ThemedIonicons } from "../themed/ThemedIonicons";

export type PasswordInputProps = TextInputProps & {
  password: string;
  setPassword: (password: string) => void;
};

export function PasswordInput({
  style,
  password,
  setPassword,
  ...rest
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <ThemedTextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        style={style}
        {...rest}
      />
      <ThemedIonicons
        name={showPassword ? "eye-off" : "eye"}
        size={24}
        onPress={() => setShowPassword(!showPassword)}
        style={styles.icon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    right: 10,
  },
});
