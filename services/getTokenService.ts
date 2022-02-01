import axios from "axios";
import {Config} from "../models/Config"
import logger from "../logger/winston"
import {Injectable} from "@decorators/di";

const qs = require("qs")

/**
 *
 * accessToken 값 리턴
 * refreshToken값이 있을 경우, 데이터 베이스를 업데이트 한다.
 * @returns {Promise<string : token>}
 */
@Injectable()
export default class GetTokenService {
  async getToken() {

    let token = ""

    try {

      logger.info(`refreshing accessToken from KaKao ...`)

      // @ts-ignore
      const {value: refreshToken} = await Config.findOne({where: {key: "refreshToken"}, raw: true})
      logger.info(`refresh Token found : ${refreshToken}`)

      const apiRes = await axios.post(`https://kauth.kakao.com/oauth/token`, qs.stringify({
            grant_type: "refresh_token",
            client_id: process.env.KAKAO_CLIENT_ID,
            refresh_token: refreshToken
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          })

      logger.info(`token refreshed : api response = ${JSON.stringify(apiRes.data)}`)

      token = apiRes?.data?.access_token || ""

      // refresh token 값이 있을 경우 갱신한다.
      if (apiRes?.data?.refresh_token) {
        logger.info(`updating refresh token....`)
        const updateRes = await Config.update({
          value: apiRes.data.refresh_token
        }, {
          where: {
            key: "refreshToken"
          }
        })

        logger.info(`refresh token is updated to database, update result: ${JSON.stringify(updateRes)}`)
      }

    } catch (err) {
      throw err
    } finally {
      return token
    }
  }
}
