import axios from "axios";

const qs = require("qs")

const sendMessageService = async (token: string) => {
  try {

    const requestObj: any = JSON.stringify({
      object_type: "text",
      text: "텍스트 영역입니다. 최대 200자 표시 가능합니다.",
      link: {
        "web_url": "https://developers.kakao.com",
        "mobile_web_url": "https://developers.kakao.com"
      },
      button_title: "바로 확인"
    })

    const apiRes = await axios.post("https://kapi.kakao.com/v2/api/talk/memo/default/send",
        qs.stringify({template_object: requestObj}), {
          headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        })

    console.log(`api response = ${apiRes?.data || "no data"}`)


  } catch (err: any) {
    console.log(err)
    console.log(err.message || err?.stack || "err")
  }
}

module.exports = sendMessageService