export type AccessTokenResponse = {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
};

export type UserWord = {
  id: number;
  userId: string;
  word: string;
  reading: string;
  level: number;
  nextReviewDay: string;
  userSynonyms: string[];
  skipped: boolean;
};

export type WordBase = {
  id: number;
  word: string;
  reading: string;
  meaning: string;
  frequencyRank: number;
  jlptLevel: string;
};

export type WordData = {
  id: number;
  wordBase: WordBase;
  readings: string[];
  meanings: string[];
  partsOfSpeech: string[];
  sentences: Sentence[];
};

export type Sentence = {
  id: number;
  wordDataid: number;
  japanese: string;
  english: string;
};
