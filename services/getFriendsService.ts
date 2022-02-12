import logger from "../logger/winston"
import axios from "axios";
import {Injectable} from "@decorators/di";

@Injectable()
export default class GetFriendsService {
  /**
   * 나의 친구목록을 가져와줌 친구목록 : elements
   * @param token: string
   * @returns {Promise<[token: string]>}
   */
  async getFriends(token): Promise<Array<string>> {
    try {
      let friendsUuidArr = []
      // 초대된 친구 친구목록 받기 동의 과정
      // https://kangprog.tistory.com/101
      logger.info(`searching my friends list from Kakao...`)
      const {data} = await axios.get("https://kapi.kakao.com/v1/api/talk/friends", {
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      })

      logger.info(`my friends list received. api response = ${JSON.stringify(data)}`)

      if (data.elements.length) {
        friendsUuidArr = data.elements.map(elem => elem.uuid)
      } else {
        throw new Error("no friends data")
      }

      return friendsUuidArr
    } catch (err: any) {
      throw err
    }
  }
}