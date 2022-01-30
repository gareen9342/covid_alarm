import * as express from "express";
import 'dotenv/config'
import dateUtils from "./util/dateUtils";

import getTokenService from "./services/getTokenService"
import sendMessageService from "./services/sendMessageService"
import getCoronaDataService from "./services/getCoronaDataService"

const app: express.Application = express();

app.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.send("hello typescript express!");
    }
);


app.post("/message", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const accessToken = await getTokenService()
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
  } finally {
    res.send("message service")
  }
})


app.use((err: express.Errback, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).send({error: 'Something failed!'});
})


export default app;