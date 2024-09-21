import { View, ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedLineDivider({style, lightColor, darkColor}: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <View style={[style, { backgroundColor }, {borderBottomColor: borderColor, borderBottomWidth: 1}]}  />;
}
