import { useEffect } from "react";
import ThemedView from "../themed/ThemedView";
import { StyleSheet } from "react-native";
import ThemedText from "../themed/ThemedText";

export type ReviewForecastProps = {
  reviewCountMap: Map<number, number>;
};

export default function ReviewForecast({ reviewCountMap }: ReviewForecastProps) {
  const day = new Date().getDay();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const xAxis = weekDays.slice(day + 1).concat(weekDays.slice(0, day + 1));

  const yAxis = Array.from({ length: 7 }, (_, i) => {
    const count = reviewCountMap.get(i + 1) || 0;
    return count;
  });

  const maxCount = Math.max(...yAxis);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Upcoming
      </ThemedText>
      <ThemedView style={styles.graphContainer}>
        {yAxis.map((count, i) => (
          <ThemedView key={i} style={styles.barContainer}>
            <ThemedText style={styles.countLabel}>
              {count > 0 ? count : ""}
            </ThemedText>
            <ThemedView
              key={i}
              style={[
                styles.bar,
                {
                  height: `${(count / maxCount) * 77}%`,
                  borderWidth: count < 1 ? 0 : 0.5,
                },
              ]}
            />
            <ThemedText style={styles.dayLabel}>{xAxis[i]}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  title: {
    fontSize: 20,
  },
  graphContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: "85%",
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
    marginTop: 6,
  },
  countLabel: {
    fontSize: 12,
  },
});
