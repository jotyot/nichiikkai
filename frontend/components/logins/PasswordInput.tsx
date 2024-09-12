import { NamedField } from "./NamedField";

export type PasswordInputProps = {
  password: string;
  setPassword: (password: string) => void;
};

export function PasswordInput({ password, setPassword }: PasswordInputProps) {
  return (
    <NamedField
      name="Password"
      fieldContent={password}
      setFieldContent={setPassword}
      secureTextEntry={true}
    />
  );
}
