import { Router } from "express";
import { getSessionByCode } from "./api/getSessionByCode";
import { postStartSessions } from "./api/postStartSession";

const sessionRouter = Router();

sessionRouter.get("/code/:code", getSessionByCode);

sessionRouter.post("/:id/start", postStartSessions);

export default sessionRouter;
