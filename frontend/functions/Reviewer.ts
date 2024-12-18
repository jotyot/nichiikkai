/*
  The reviewQueue is made up of kanji@reading strings
  So are the maps and sets
*/
export class Reviewer {
  private reviewQueue: string[];
  private halfDone: Map<string, "reading" | "meaning">;
  private completed: Set<string>;
  private failed: Set<string>;
  private currentReviewType: "reading" | "meaning" = "reading";

  constructor(reviewQueue: string[]) {
    this.reviewQueue = reviewQueue;
    this.halfDone = new Map();
    this.completed = new Set();
    this.failed = new Set();
  }

  /* 
    Gets the first word in the queue and assigns the current review type.
    Word is undefined if there are no words in the queue.
  */
  public GetCurrentReviewEntry(): ReviewEntry {
    const wordPair = this.reviewQueue.at(0);
    if (!wordPair) return { wordPair: undefined, type: "reading" };

    const halfDoneType = this.halfDone.get(wordPair);
    let reviewType: "reading" | "meaning";
    if (halfDoneType) {
      // If word has been half done, use the other type
      reviewType = halfDoneType == "reading" ? "meaning" : "reading";
    } else {
      reviewType = Math.random() < 0.5 ? "reading" : "meaning";
    }
    this.currentReviewType = reviewType;

    return { wordPair: wordPair, type: reviewType };
  }

  // Gets the second word in queue for advance data fetching purposes.
  public GetNextReviewEntry(): string | undefined {
    return this.reviewQueue.at(1);
  }

  private insertWord(wordPair: string, position: number) {
    this.reviewQueue.splice(position, 0, wordPair);
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Shifts the queue
  public GiveAnswer(correct: boolean) {
    const wordPair = this.reviewQueue.shift();
    if (!wordPair) throw new Error("No word to review");

    if (correct) {
      if (this.halfDone.has(wordPair)) {
        this.completed.add(wordPair);
        this.halfDone.delete(wordPair);
      } else {
        this.halfDone.set(wordPair, this.currentReviewType);

        const insertPosition = this.randomInt(0, 4);
        this.insertWord(wordPair, insertPosition);
      }
    } else {
      this.failed.add(wordPair);

      const insertPosition = this.randomInt(3, 6);
      this.insertWord(wordPair, insertPosition);
    }
  }

  public GetCompleted(): Set<string> {
    return this.completed;
  }

  public GetFailed(): Set<string> {
    return this.failed;
  }

  public GetCorrect(): Set<string> {
    return this.completed.difference(this.failed);
  }
}

export type ReviewEntry = {
  wordPair: string | undefined;
  type: "reading" | "meaning";
};