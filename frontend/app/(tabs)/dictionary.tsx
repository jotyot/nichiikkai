import ThemedView from "@/components/themed/ThemedView";
import { useEffect, useState, memo } from "react";
import { GetUserLevels } from "@/functions/Storage";
import { StyleSheet, SafeAreaView, VirtualizedList } from "react-native";
import CheckBox from "@/components/dictionary/Checkbox";
import { GETWords } from "@/functions/APICalls";
import { WordBase } from "@/types/Types";
import DictionaryEntry from "@/components/dictionary/DictionaryEntry";
import DictionaryLabel from "@/components/dictionary/DictionaryLabel";
import EmptyDictionary from "@/components/dictionary/EmptyDictionary";
import FilterButton from "@/components/dictionary/FilterButton";
import SearchButton from "@/components/dictionary/WideButton";
import ThemedText from "@/components/themed/ThemedText";
import PageButton from "@/components/dictionary/PageButton";

export default function Dictionary() {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [words, setWords] = useState<WordBase[]>([]);
  const [jlptOrder, setJlptOrder] = useState<"ascending" | "descending">(
    "ascending"
  );
  const [orderBy, setOrderBy] = useState<"alphabetical" | "frequency">(
    "alphabetical"
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      const userLevels = await GetUserLevels();
      setSelectedLevels(userLevels);
      const words = await GETWords(userLevels);
      setWords(words);
    })();
  }, []);

  async function search() {
    setWords([]);
    const words = await GETWords(selectedLevels, page, jlptOrder, orderBy);
    setWords(words);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.levelContainer}>
        {["N1", "N2", "N3", "N4", "N5"].map((level, i) => (
          <CheckBox
            key={i}
            label={level}
            on={selectedLevels.includes(level)}
            onChange={(value) => {
              setSelectedLevels((prev) =>
                value
                  ? [...prev, level]
                  : prev.filter((selected) => selected !== level)
              );
            }}
          />
        ))}
      </ThemedView>
      <ThemedView style={styles.filterContainer}>
        <FilterButton
          title={"Level grouping: "}
          value={jlptOrder}
          onPress={() =>
            setJlptOrder(jlptOrder === "ascending" ? "descending" : "ascending")
          }
          width={190}
        />
        <FilterButton
          title={"Sort By: "}
          value={orderBy}
          onPress={() =>
            setOrderBy(
              orderBy === "alphabetical" ? "frequency" : "alphabetical"
            )
          }
          width={150}
        />
      </ThemedView>
      <SearchButton
        text={"Search"}
        onPress={() => {
          setPage(1);
          search();
        }}
      />
      <DictionaryLabel />
      <SafeAreaView style={styles.wordContainer}>
        <VirtualizedList
          data={words}
          initialNumToRender={20}
          renderItem={({ item }) => <OptimizedEntry wordBase={item} />}
          keyExtractor={(item: WordBase) => item.id.toString()}
          getItemCount={() => words.length}
          getItem={(data, index) => data[index]}
          ListEmptyComponent={EmptyDictionary}
        ></VirtualizedList>
      </SafeAreaView>
      <ThemedView style={styles.pageContainer}>
        <PageButton
          title={"Prev 500"}
          onPress={() => {
            setPage((prev) => prev - 1);
            search();
          }}
          disabled={page === 1}
        />
        <ThemedText style={{ fontSize: 20 }}>{page}</ThemedText>
        <PageButton
          title={"Next 500"}
          onPress={() => {
            setPage((prev) => prev + 1);
            search();
          }}
        />
      </ThemedView>
    </ThemedView>
  );
}

const OptimizedEntry = memo(DictionaryEntry);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    width: 350,
    margin: 5,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
    width: 350,
  },
  wordContainer: {
    height: 500,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "white",
  },
  pageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    width: 350,
  },
});
