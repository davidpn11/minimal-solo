import { Router } from 'express';
import {postBuyCards} from "./api/postBuyCards";

const cards = Router();

cards.post('/buy', postBuyCards);

export default cards;