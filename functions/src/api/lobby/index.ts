import { Router } from 'express';
import {postCreateLobby} from "./api/postCreateLobby";

const lobby = Router();

lobby.post('/', postCreateLobby);

export default lobby;