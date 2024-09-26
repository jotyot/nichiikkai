export class Reviewer {
  private reviewWords: string[];
  private reviewBatch: string[];
  private wordsToFetch: string[];
  private reviewQueue: ReviewEntry[];
  private wordResults: WordLevelUpdate[] = [];
  private reviewRecord: Map<string, ReviewRecordEntry>;

  public constructor(reviewWords: string[]) {
    this.reviewBatch = reviewWords.slice(0, 10);
    this.wordsToFetch = this.reviewBatch;
    this.reviewWords = reviewWords.slice(10);
    this.reviewRecord = this.setReviewRecord(
      new Map<string, ReviewRecordEntry>()
    );
    this.reviewQueue = this.generateReviewQueue();
  }

  private generateReviewQueue(): ReviewEntry[] {
    const readingEntry: ReviewEntry[] = this.reviewBatch.map((wordPair) => ({
      wordPair: wordPair,
      answerType: "reading",
    }));
    const meaningEntry: ReviewEntry[] = this.reviewBatch.map((wordPair) => ({
      wordPair: wordPair,
      answerType: "meaning",
    }));
    return readingEntry.concat(meaningEntry).sort(() => Math.random() - 0.5);
  }

  private setReviewRecord(
    reviewRecord: Map<string, ReviewRecordEntry>
  ): Map<string, ReviewRecordEntry> {
    this.reviewBatch.forEach((wordPair) => {
      reviewRecord.set(wordPair, {
        meaningStatus: "pending",
        readingStatus: "pending",
      });
    });
    return reviewRecord;
  }

  public GetNextWord(): ReviewEntry | undefined {
    return this.reviewQueue.pop();
  }

  public UpdateReviewRecord(
    wordPair: string,
    answerType: "meaning" | "reading",
    status: "correct" | "incorrect"
  ) {
    const record = this.reviewRecord.get(wordPair);
    if (record === undefined) {
      throw new Error("Record not found");
    }
    if (answerType === "meaning") {
      record.meaningStatus = status;
    } else {
      record.readingStatus = status;
    }

    this.reviewRecord.set(wordPair, record);

    if (
      record.meaningStatus !== "pending" &&
      record.readingStatus !== "pending"
    ) {
      this.reviewBatch = this.reviewBatch.filter((word) => word !== wordPair);
      this.wordResults.push({
        word: wordPair,
        levelUp:
          record.meaningStatus === "correct" &&
          record.readingStatus === "correct",
      });
      if (this.reviewBatch.length < 2) {
        this.newBatch();
      }
    }
  }

  private newBatch(): void {
    this.reviewBatch = this.reviewBatch.concat(this.reviewWords.slice(0, 10));
    this.wordsToFetch = this.reviewWords.slice(0, 10);
    this.reviewWords = this.reviewWords.slice(10);
    this.reviewRecord = this.setReviewRecord(this.reviewRecord);
    this.reviewQueue = this.reviewQueue.concat(this.generateReviewQueue());
  }

  public GetWordsToFetch(): string[] {
    return this.wordsToFetch;
  }

  public GetWordResults(): WordLevelUpdate[] {
    return this.wordResults;
  }
}

type ReviewEntry = {
  wordPair: string;
  answerType: "meaning" | "reading";
};

type ReviewRecordEntry = {
  meaningStatus: "correct" | "incorrect" | "pending";
  readingStatus: "correct" | "incorrect" | "pending";
};

type WordLevelUpdate = {
  word: string;
  levelUp: boolean;
};
