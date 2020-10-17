import { Router } from "express";
import { postCreateLobby } from "./api/postCreateLobby";
import { postStartGame } from "./api/postStartGame";

const lobby = Router();

lobby.post("/", postCreateLobby);

lobby.post("/:id/start", postStartGame);

export default lobby;
