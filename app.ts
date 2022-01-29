import * as express from "express";
import axios from "axios";
import 'dotenv/config'

const qs = require("qs")

const app: express.Application = express();


app.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.send("hello typescript express!");
    }
);

app.post("/message", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // const apiRes = await axios.post("https://kauth.kakao.com/oauth/token", {
    //   "grant_type": "authorization_code",
    //   "client_id": process.env.KAKAO_CLIENT_ID,
    //   "redirect_uri": "http://localhost:5000",
    //   "code": code 넣기 ...
    // }, {
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    //   }
    // })
    //

    const requestObj: any = JSON.stringify({
      object_type: "text",
      text: "텍스트 영역입니다. 최대 200자 표시 가능합니다.",
      link: {
        "web_url": "https://developers.kakao.com",
        "mobile_web_url": "https://developers.kakao.com"
      },
      button_title: "바로 확인"
    })
    const apiRes = await axios.post("https://kapi.kakao.com/v2/api/talk/memo/default/send", qs.stringify({template_object: requestObj}), {
      headers: {
        "Authorization": `Bearer ${process.env.KAKAO_IMSI_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    console.log(apiRes)
    console.log(apiRes?.data)


  } catch (err: any) {
    console.log(err)
    console.log(err.message || err?.stack || "err")
  } finally {
    res.send("asdf")
  }
  // axios.post()
})

export default app;