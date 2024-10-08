import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "../themed/ThemedText";

export type LearnButtonProps = {
    onPress: () => void;
};

export function LearnButton({onPress}: LearnButtonProps) {
    return (
        <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
        >
            <ThemedText style={styles.text}>Learn</ThemedText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        position: "absolute",
        width: 120,
        height: 120,
        padding: 10,
        bottom: 20,
        right: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "salmon",
        borderRadius: 40,
    },
    text: {},
});
