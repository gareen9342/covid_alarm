import axios from "axios";

const qs = require("qs")

/**
 * access Token은 갱신한다. refreshToken이 있을 경우에 환경변수 재세팅
 */
const getTokenService = async () => {
  let token = ""
  try {
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

    console.log(`token refreshed : api response = ${JSON.stringify(apiRes)}`)

    token = apiRes?.data?.accessToken || ""

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
module.exports = getTokenService

