import { Router } from "express";
import * as admin from "firebase-admin";

const sessionRouter = Router();

sessionRouter.get("/code/:code", async (req, res) => {
  const { code } = req.params;

  const sessionByCode = await admin
    .firestore()
    .collection("session")
    .where("code", "==", code)
    .get();

  const [sessionDoc] = sessionByCode.docs.values();

  const session = sessionDoc.data();
  const playersDoc = sessionDoc.get("players");
  const players = playersDoc.data();

  return res.send({ ...session, players });
});

export default sessionRouter;
