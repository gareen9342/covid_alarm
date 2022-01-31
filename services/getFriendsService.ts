import logger from "../logger/winston"
import axios from "axios";

const getFriendsService = async (token: string) => {
  try {
    logger.info(`searching my friends list from Kakao...`)
    const apiRes = await axios.get("https://kapi.kakao.com/v1/api/talk/friends", {
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })

    logger.info(`my friends list received. api response = ${JSON.stringify(apiRes)}`)

    return apiRes.data
  } catch (err: any) {
    throw err
  }
}

export default getFriendsService