import axios from "axios";
import {Config} from "../models/Config"
import logger from "../logger/winston"

const qs = require("qs")

/**
 *
 * accessToken 값 리턴
 * refreshToken값이 있을 경우, 데이터 베이스를 업데이트 한다.
 * @returns {Promise<string : token>}
 */
const getTokenService = async () => {

  let token = ""
  try {
    logger.info(`trying refreshing accessToken from KaKao ...`)

    // @ts-ignore
    const {value: refreshToken} = await Config.findOne({where: {key: "refreshToken"}, raw: true})
    console.log(refreshToken)
    logger.debug(`refresh Token found : ${refreshToken}`)

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
      const updateRes = await Config.update({
        value: apiRes.data.refresh_token
      }, {
        where: {
          key: "refreshToken"
        }
      })

      logger.info(`${JSON.stringify(updateRes)}`)
    }

  } catch (err) {
    //handler error
    throw err
  } finally {
    return token
  }
}
export default getTokenService

