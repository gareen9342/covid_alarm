import axios from "axios";

const qs = require("qs")

/**
 *
 * accessToken 값 리턴
 * refreshToken값이 있을 경우, 임시적으로 환경변수를 변경한다.
 * TODO : 현재는 환경변수를 이용하지만 데이터베이스에 저장을 해야할 듯
 * @returns {Promise<string : token>}
 */
const getTokenService = async () => {
  let token = ""
  try {
    console.log(`access token refresh requset `)
    const apiRes = await axios.post(`https://kauth.kakao.com/oauth/token`, qs.stringify({
          grant_type: "refresh_token",
          client_id: process.env.KAKAO_CLIENT_ID,
          refresh_token: process.env.KAKAO_REFRESH_TOKEN
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
      process.env.KAKAO_REFRESH_TOKEN = apiRes.data.refresh_token
    }

  } catch (err) {
    //handler error
  } finally {
    return token
  }
}
export default getTokenService

