import logger from "../logger/winston"
import axios from "axios";
import {Injectable} from "@decorators/di";

@Injectable()
export default class GetFriendsService {
  /**
   * 나의 친구목록을 가져와줌 친구목록 : elements
   * @param token: string
   * @returns {Promise<apiResponse>}
   */
  async getFriends(token) {
    try {

      // globalThis.myConsole("hello")
      logger.info(`searching my friends list from Kakao...`)
      const apiRes = await axios.get("https://kapi.kakao.com/v1/api/talk/friends", {
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      })

      logger.info(`my friends list received. api response = ${JSON.stringify(apiRes.data)}`)

      return apiRes.data
    } catch (err: any) {
      throw err
    }
  }
}