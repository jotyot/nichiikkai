import { WordData } from "@/types/Types";
import { ThemedText } from "../themed/ThemedText";
import { ThemedView } from "../themed/ThemedView";
import { Collapsible } from "../Collapsible";

export type ReviewInfoProps = {
  wordData: WordData | undefined;
};

export function ReviewInfo({ wordData }: ReviewInfoProps) {
  return wordData ? (
    <ThemedView>
      <Collapsible title="Meaning">
        <ThemedText>{wordData.meanings.join(", ")}</ThemedText>
        <ThemedText>Word Type</ThemedText>
        {wordData.partsOfSpeech.map((part, index) => (
          <ThemedText key={index}>{part}</ThemedText>
        ))}
      </Collapsible>

      <Collapsible title="Reading">
        {wordData.readings.map((reading, index) => (
          <ThemedText key={index}>{reading}</ThemedText>
        ))}
      </Collapsible>
    </ThemedView>
  ) : (
    <ThemedText>Loading...</ThemedText>
  );
}
