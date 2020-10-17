import { Router } from "express";
import { getSessionByCode } from "./api/getSessionByCode";

const sessionRouter = Router();

sessionRouter.get("/code/:code", getSessionByCode);

export default sessionRouter;
