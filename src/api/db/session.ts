import { database } from "../firebase";

export async function requestCreateSession(name: string) {
  try {
    console.log("set");
    const res = await database.collection("session").doc("one").set({
      name: "david",
    });
    console.log(res);
  } catch (error) {
    console.error(error);
  }
}
