import axios from 'axios';
import {SessionPlayerWithId} from "../../model/Player";
import {firebaseConfig} from "../config";

export async function buyCard(sessionId: string, playerId: string, amount = 1) {
  try {
    const response = await axios.request<SessionPlayerWithId>({
      method: 'POST',
      baseURL: firebaseConfig.baseApi,
      url: '/cards/buy',
      data: {
        sessionId,
        playerId,
        amount,
      },
    });
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
