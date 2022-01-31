import * as express from "express"
import 'dotenv/config'

const cron = require("node-cron")

import dateUtils from "./util/dateUtils"
import driver from "./config/driver";
import getTokenService from "./services/getTokenService"
import sendMessageService from "./services/sendMessageService"
import getCoronaDataService from "./services/getCoronaDataService"
import initData from "./config/config";

const app: express.Application = express();
// sequelize setting
(async () => {
  await driver()
  await initData()
})()

// health check
app.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.send("hello typescript express!");
    }
);

// 매일 아침 8시 실행
cron.schedule("0 8 * * *", async () => {
  try {
    console.log(`do cron job`)
    const accessToken = await getTokenService()
    if (!accessToken?.length) {
      throw new Error("token is not refreshed")
    }
    const coronaData = await getCoronaDataService()
    if (coronaData) {
      await sendMessageService(accessToken, `
        ${dateUtils.getTodayDate()}의 코로나 확진자 수

        * * * * * * * * * *
        - 어제의 확진자수: ${coronaData.totalCase}
        - 전체 확진자수: ${coronaData.totalCaseBefore}
        - 현재 확진자수: ${coronaData.nowCase}
        (기준 업데이트 시간: ${coronaData.updateTime})
      `)
    }
  } catch (err) {
    throw err
  }
})

// test용
app.post("/message", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    console.log(`do cron job`)
    const accessToken = await getTokenService()
    if (!accessToken?.length) {
      throw new Error("token is not refreshed")
    }
    const coronaData = await getCoronaDataService()
    if (coronaData) {
      await sendMessageService(accessToken, `
        ${dateUtils.getTodayDate()}의 코로나 확진자 수

        * * * * * * * * * * 
        - 어제의 확진자수: ${coronaData.totalCase}
        - 전체 확진자수: ${coronaData.totalCaseBefore}
        - 현재 확진자수: ${coronaData.nowCase}
        (기준 업데이트 시간: ${coronaData.updateTime})
      `)
    }
    res.send("aa")
  } catch (err) {
    next(err)
  }
})
// TODO : 과연 이 에러 핸들러는 쓰일 것인가
app.use((err: express.Errback, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).send({error: 'Something failed!'});
})


export default app;