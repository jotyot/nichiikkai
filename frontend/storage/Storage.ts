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

export const setAccessTokenResponse = async (reponse: object) => {
  await storeData("accessToken", JSON.stringify(reponse));
};

export const getAccessTokenResponse = async () => {
  const value = await getData("accessToken");
  if (!value) throw new Error("No access token found");
  return JSON.parse(value);
};
