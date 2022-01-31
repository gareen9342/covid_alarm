import express from "express"
import 'dotenv/config'
import {attachControllers} from "@decorators/express";

const cron = require("node-cron")
import driver from "./config/driver";

import MessageController from "./controllers/MessageController"

const app: express.Application = express();

// sequelize setting
(async () => {
  await driver()
  // await initData()
})()

attachControllers(app, [MessageController])

// health check
app.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.send("hello typescript express!");
    }
);

// 매일 아침 8시 실행
// cron.schedule("0 8 * * *", async () => {
//   try {
//     console.log(`do cron job`)
//     const accessToken = await getTokenService()
//     if (!accessToken?.length) {
//       throw new Error("token is not refreshed")
//     }
//     const getCoronaDataService = new GetCoronaDataService();
//     const coronaData = await getCoronaDataService.getData()
//     if (coronaData) {
//       const sendMessageService = new SendMessageService();
//       await sendMessageService.send(accessToken, `
//         ${dateUtils.getTodayDate()}의 코로나 확진자 수
//
//         * * * * * * * * * *
//         - 어제의 확진자수: ${coronaData.totalCaseBefore}
//         - 전체 확진자수: ${coronaData.totalCase}
//         - 현재 확진자수: ${coronaData.nowCase}
//         (기준 업데이트 시간: ${coronaData.updateTime})
//       `)
//     }
//   } catch (err) {
//     throw err
//   }
// })

// app.post("/friends", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//   try {
//     const accessToken = await getTokenService()
//     if (!accessToken?.length) {
//       throw new Error("token is not refreshed")
//     }
//     await getFriendsService(accessToken).then(val => {
//       console.log(val)
//     })
//     res.send("asdf")
//   } catch (err) {
//     next(err)
//   }
// })

// TODO : 과연 이 에러 핸들러는 쓰일 것인가
app.use((err: express.Errback, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).send({error: 'Something failed!'});
})


export default app;
