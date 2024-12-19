import { useEffect } from "react";
import ThemedView from "../themed/ThemedView";
import { StyleSheet } from "react-native";
import ThemedText from "../themed/ThemedText";

export type ReviewForecastProps = {
  reviewCountMap: Map<number, number>;
};

export default function ReviewForecast({
  reviewCountMap,
}: ReviewForecastProps) {
  const borderColor = "white";
  const day = new Date().getDay();
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const xAxis = weekDays.slice(day + 1).concat(weekDays.slice(0, day + 1));

  const yAxis = Array.from({ length: 7 }, (_, i) => {
    const count = reviewCountMap.get(i + 1) || 0;
    return count;
  });

  const maxCount = Math.max(...yAxis);

  useEffect(() => {
    console.log(yAxis);
  }, []);

  return (
    <ThemedView style={[styles.container, { borderColor: borderColor }]}>
      {yAxis.map((count, i) => (
        <ThemedView key={i} style={styles.barContainer}>
          <ThemedText style={styles.dayLabel}>
            {count > 0 ? count : ""}
          </ThemedText>
          <ThemedView
            key={i}
            style={[
              styles.bar,
              {
                height: `${(count / maxCount) * 80}%`,
                borderWidth: count < 1 ? 0 : 0.5,
                borderColor: borderColor,
              },
            ]}
          />
          <ThemedText style={styles.dayLabel}>{xAxis[i]}</ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  barContainer: {
    width: "11%",
    alignItems: "center",
  },
  bar: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "teal",
  },
  dayLabel: {
    fontSize: 12,
    marginTop: 5,
  },
});
