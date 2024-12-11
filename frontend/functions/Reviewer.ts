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
    const word = this.reviewQueue.at(0);
    if (!word) return { word: undefined, type: "reading" };

    const halfDoneType = this.halfDone.get(word);
    let reviewType: "reading" | "meaning";
    if (halfDoneType) {
      // If word has been half done, use the other type
      reviewType = halfDoneType == "reading" ? "meaning" : "reading";
    } else {
      reviewType = Math.random() < 0.5 ? "reading" : "meaning";
    }
    this.currentReviewType = reviewType;

    return { word, type: reviewType };
  }

  // Gets the second word in queue for advance data fetching purposes.
  public GetNextReviewEntry(): string | undefined {
    return this.reviewQueue.at(1);
  }

  private insertWord(word: string, position: number) {
    this.reviewQueue.splice(position, 0, word);
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Shifts the queue
  public GiveAnswer(correct: boolean) {
    const word = this.reviewQueue.shift();
    if (!word) throw new Error("No word to review");

    if (correct) {
      if (this.halfDone.has(word)) {
        this.completed.add(word);
        this.halfDone.delete(word);
      } else {
        this.halfDone.set(word, this.currentReviewType);

        const insertPosition = this.randomInt(0, 4);
        this.insertWord(word, insertPosition);
      }
    } else {
      this.failed.add(word);

      const insertPosition = this.randomInt(3, 6);
      this.insertWord(word, insertPosition);
    }
  }

  public GetCompleted(): Set<string> {
    return this.completed;
  }

  public GetFailed(): Set<string> {
    return this.failed;
  }
}

export type ReviewEntry = {
  word: string | undefined;
  type: "reading" | "meaning";
};