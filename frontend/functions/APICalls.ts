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

export async function PUTUserLevels(accessToken: string, levels: string[]) {
  const response = await fetch(
    "https://backend-image-952837685482.us-central1.run.app/NIK/selected-levels",
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(levels),
    }
  );
  if (response.status !== 200) {
    throw new Error("Failed to update user levels: " + response.status);
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

export async function POSTRegister(username: string, password: string) {
  const response = await fetch(
    "https://backend-image-952837685482.us-central1.run.app/identity/register",
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
    const data = await response.json();
    throw new Error("Failed to register: " + response.status, {
      cause: data,
    });
  }
}

export async function PUTIncrementLevel(
  accessToken: string,
  wordPair: WordPair
) {
  const response = await fetch(
    "https://backend-image-952837685482.us-central1.run.app/NIK/words/" +
      wordPair.word +
      "/" +
      wordPair.reading +
      "/increment-level",
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
    "https://backend-image-952837685482.us-central1.run.app/NIK/words/" +
      wordPair.word +
      "/" +
      wordPair.reading +
      "/decrement-level",
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

export async function POSTAddUserWord(accessToken: string, wordPair: WordPair) {
  const response = await fetch(
    "https://backend-image-952837685482.us-central1.run.app/NIK/words/" +
      wordPair.word +
      "/" +
      wordPair.reading,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  if (response.status !== 200) {
    throw new Error("Failed to add word: " + response.status);
  }
}

export async function GETWords(
  levels: string[] = [],
  page: number = 1,
  jlptOrder: string = "ascending",
  orderBy: string = "alphabetical"
) {
  if (levels.length === 0) {
    levels = ["N1", "N2", "N3", "N4", "N5"];
  }
  const response = await fetch(
    "https://dictionary-952837685482.us-west1.run.app/Dictionary/" +
      "?levels=" +
      levels.join("&levels=") +
      "&page=" +
      page +
      "&jlptOrder=" +
      jlptOrder +
      "&orderBy=" +
      orderBy
  );
  if (response.status === 200) {
    const data: WordBase[] = await response.json();
    return data;
  } else {
    throw new Error("Failed to get word data: code " + response.status);
  }
}