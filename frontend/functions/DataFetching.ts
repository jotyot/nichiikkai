import { AccessTokenResponse, UserWord, WordBase, WordData, WordPair } from "@/types/Types";

export async function FetchWordData(wordPair: WordPair) {
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

export async function FetchWordOfTheDay(
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

export async function FetchUserWords(accessToken: string) {
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

export async function FetchUserLevels(accessToken: string) {
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

export async function FetchLoginInfo(username: string, password: string) {
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
