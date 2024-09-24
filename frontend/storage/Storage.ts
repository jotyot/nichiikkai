import { AccessTokenResponse, UserWord, WordBase } from "@/types/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
};

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log(e);
  }
};

export const setLoginInfo = async (username: string, password: string) => {
  await Promise.all([
    storeData("username", username),
    storeData("password", password),
  ]);
};

export const getLoginInfo = async () => {
  const [username, password] = await Promise.all([
    getData("username"),
    getData("password"),
  ]);
  return { username, password };
};

export const removeLoginInfo = async () => {
  await Promise.all([
    AsyncStorage.removeItem("username"),
    AsyncStorage.removeItem("password"),
  ]);
};

export const setAccessTokenResponse = async (reponse: AccessTokenResponse) => {
  await storeData("accessToken", JSON.stringify(reponse));
};

export const getAccessTokenResponse: () => Promise<AccessTokenResponse> =
  async () => {
    const value = await getData("accessToken");
    if (!value) throw new Error("No access token found");
    return JSON.parse(value);
  };

export const setUserLevels = async (levels: string[]) => {
  await storeData("levels", JSON.stringify(levels));
};

export const getUserLevels: () => Promise<string[]> = async () => {
  const value = await getData("levels");
  if (!value) throw new Error("No levels found");
  return JSON.parse(value);
};

export const setUserWords = async (userWords: UserWord[]) => {
  await storeData("userWords", JSON.stringify(userWords));
};

export const getUserWords: () => Promise<UserWord[]> = async () => {
  const value = await getData("userWords");
  if (!value) throw new Error("No user words found");
  return JSON.parse(value);
};

export const setWordOfTheDay = async (word: WordBase) => {
  await storeData("wordOfTheDay", JSON.stringify(word));   
}

export const getWordOfTheDay: () => Promise<WordBase> = async () => {
  const value = await getData("wordOfTheDay");
  if (!value) throw new Error("No word of the day found");
  return JSON.parse(value);
}

export const setLastWordDate = async (date: string) => {
  await storeData("lastWordDate", date);
}

export const getLastWordDate: () => Promise<string> = async () => {
  const value = await getData("lastWordDate");
  if (!value) throw new Error("No last word date found");
  return value;
}