import {
  AccessTokenResponse,
  UserWord,
  WordBase,
  WordData,
  WordPair,
} from "@/types/Types";

export async function GETWordData(wordPair: WordPair) {
  const response = await fetch(
    "https://dictionary-952837685482.us-west1.run.app/Dictionary/" +
      wordPair.word +
      "/" +
      wordPair.reading
  );
  if (response.status === 200) {
    const data: WordData = await response.json();
    return data;
  } else {
    throw new Error("Failed to get word data: code " + response.status);
  }
}

export async function GETWordOfTheDay(
  userLevels: string[],
  wordPairs: WordPair[]
) {
  const response = await fetch(
    "https://dictionary-952837685482.us-west1.run.app/Dictionary/generate-word" +
      "?levels=" +
      userLevels.join("&levels="),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wordPairs),
    }
  );
  if (response.status === 200) {
    const data: WordBase = await response.json();
    return data;
  } else {
    throw new Error("Failed to get word of the day: " + response.status);
  }
}

export async function GETUserWords(accessToken: string) {
  const response = await fetch(
    "https://backend-image-952837685482.us-central1.run.app/NIK/words",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  if (response.status === 200) {
    const data: UserWord[] = await response.json();
    return data;
  } else {
    throw new Error("Failed to get user data: " + response.status);
  }
}

export async function GETUserLevels(accessToken: string) {
  const response = await fetch(
    "https://backend-image-952837685482.us-central1.run.app/NIK/selected-levels",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  if (response.status === 200) {
    const data: string[] = await response.json();
    return data;
  } else {
    throw new Error("Failed to get user levels: " + response.status);
  }
}

export async function POSTLogin(username: string, password: string) {
  const response = await fetch(
    "https://backend-image-952837685482.us-central1.run.app/identity/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password: password }),
    }
  );
  if (response.status === 200) {
    const data: AccessTokenResponse = await response.json();
    return data;
  } else {
    throw new Error("Failed to login: " + response.status);
  }
}

export async function PUTIncrementLevel(
  accessToken: string,
  wordPair: WordPair
) {
  const response = await fetch(
    "https://backend-image-952837685482.us-central1.run.app/NIK/words" +
      wordPair.word +
      "/" +
      wordPair.reading +
      "increment-level",
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  if (response.status !== 200) {
    throw new Error("Failed to increment level: " + response.status);
  }
}

export async function PUTDecrementLevel(
  accessToken: string,
  wordPair: WordPair
) {
  const response = await fetch(
    "https://backend-image-952837685482.us-central1.run.app/NIK/words" +
      wordPair.word +
      "/" +
      wordPair.reading +
      "decrement-level",
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  if (response.status !== 200) {
    throw new Error("Failed to decrement level: " + response.status);
  }
}