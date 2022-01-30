import * as express from "express";
import 'dotenv/config'

const getTokenService = require("./services/getTokenService")
const sendMessageService = require("./services/sendMessageService")

const app: express.Application = express();

app.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.send("hello typescript express!");
    }
);

import getCoronaDataService from "./services/getCoronaDataService"

(async () => {
  const coronaResult = await getCoronaDataService()
  console.log(coronaResult)
})()

app.post("/message", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const accessToken = await getTokenService()
    await sendMessageService(accessToken)
  } catch (err) {
    throw err
  } finally {
    res.send("message service")
  }
  // axios.post()
})


app.use((err: express.Errback, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).send({error: 'Something failed!'});
})


export default app;