import { useThemeColor } from "@/hooks/useThemeColor";
import Ionicons from "@expo/vector-icons/Ionicons";

export type IoniconsProps = React.ComponentProps<typeof Ionicons> & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedIonicons({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: IoniconsProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <Ionicons style={[{ color }, style]} {...otherProps} />;
}
