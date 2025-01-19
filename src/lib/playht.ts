import * as PlayHT from "playht";

export const initPlayHT = () => {
  try {
    PlayHT.init({
      apiKey: process.env.PLAYHT_API_KEY!,
      userId: process.env.PLAYHT_USER_ID!,
    });
  } catch (error) {
    console.log("Failed to initialise PlayHT SDK", JSON.stringify(error));
  }
};
