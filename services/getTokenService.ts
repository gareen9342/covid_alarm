import axios from "axios";
import {Config} from "../models/Config"

const qs = require("qs")

/**
 *
 * accessToken 값 리턴
 * refreshToken값이 있을 경우, 데이터 베이스를 업데이트 한다.
 * @returns {Promise<string : token>}
 */
declare let refreshToken: any;
const getTokenService = async () => {

  let token = ""
  try {
    console.log(`access token refresh requset`)

    const refreshToken = await Config.findOne({where: {key: "refreshToken"}})

    const apiRes = await axios.post(`https://kauth.kakao.com/oauth/token`, qs.stringify({
          grant_type: "refresh_token",
          client_id: process.env.KAKAO_CLIENT_ID,
          refresh_token: refreshToken
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
    console.log(`token refreshed : api response = ${JSON.stringify(apiRes.data)}`)

    token = apiRes?.data?.access_token || ""

    // refresh token 값이 있을 경우 갱신한다.
    if (apiRes?.data?.refresh_token) {
      await Config.update({
        value: apiRes.data.refresh_token
      }, {
        where: {
          key: "refreshToken"
        }
      }).then(config => {
        console.log(config)
      }).catch(err => {
        console.error(err)
      })
    }

  } catch (err) {
    //handler error
    throw err
  } finally {
    return token
  }
}
export default getTokenService

