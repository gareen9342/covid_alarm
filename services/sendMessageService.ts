import axios from "axios";
import logger from "../logger/winston"
import {Injectable} from "@decorators/di";

const qs = require("qs")

@Injectable()
export default class SendMessageService {
  async send(token: string, message: string) {
    try {
      logger.info(`sending message to me....`)

      const requestObj: any = JSON.stringify({
        object_type: "text",
        text: message,
        link: {
          "web_url": "http://ncov.mohw.go.kr",
          "mobile_web_url": "http://ncov.mohw.go.kr"
        },
        button_title: "코로나 확진자수 확인하기"
      })

      logger.debug(`[SEND KAKAO MESSAGE] URL : https://kapi.kakao.com/v2/api/talk/memo/default/send`)
      logger.debug(`[SEND KAKAO MESSAGE] MESSAGE OBJECT : ${JSON.stringify(requestObj)}`)

      const apiRes = await axios.post("https://kapi.kakao.com/v2/api/talk/memo/default/send",
          qs.stringify({template_object: requestObj}), {
            headers: {
              "Authorization": `Bearer ${token}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          }
      )

      logger.info(`api response = ${apiRes?.data || "no data"}`)

    } catch (err: any) {
      throw err
    }
  }
  async sendToFriends (token: string, message: string, receiver_uuids: Array<string> = []) {
    try {
      logger.info(`sending message to me....`)

      const requestObj: any = JSON.stringify({
        object_type: "text",
        text: message,
        link: {
          "web_url": "http://ncov.mohw.go.kr",
          "mobile_web_url": "http://ncov.mohw.go.kr"
        },
        button_title: "코로나 확진자수 확인하기"
      })

      logger.debug(`[SEND KAKAO MESSAGE] URL : https://kapi.kakao.com/v1/api/talk/friends/message/default/send`)
      logger.debug(`[SEND KAKAO MESSAGE] MESSAGE OBJECT : ${JSON.stringify(requestObj)}`)
      logger.debug(`[SEND KAKAO MESSAGE] FRIENDS UUID : ${JSON.stringify(receiver_uuids)}`)

      const requestData = qs.stringify({
        template_object: requestObj
      })+`&receiver_uuids=${JSON.stringify(receiver_uuids)}`

      const apiRes = await axios.post("https://kapi.kakao.com/v1/api/talk/friends/message/default/send",
          requestData, {
            headers: {
              "Authorization": `Bearer ${token}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          }
      ).catch(err => {console.error(err.response)})

      logger.info(`api response = ${apiRes?.data || "no data"}`)

    } catch (err: any) {
      throw err
    }
  }
}
