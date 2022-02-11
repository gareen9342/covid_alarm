import express from "express"
import {attachControllers} from "@decorators/express";
import logger from "./logger/winston";

const cron = require("node-cron");
import 'dotenv/config'

// custom dependencies
import driver from "./config/driver";
import MessageController from "./controllers/MessageController"
import KakaoTestController from "./controllers/KakaoTestController";

// create app instance
const app: express.Application = express();

globalThis.myConsole = (message) => {
  logger.info(message)
}
// sequelize setting
(async () => {

  globalThis.myConsole("hello")

  await driver()
})()

attachControllers(app, [MessageController, KakaoTestController])

// health check
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("hello typescript express!");
});

// 매일 아침 8시 실행
cron.schedule("10 9 * * *", () => {
  // 그냥 비동기로 던지기 굳이 기다릴 필요가 없는 듯
  MessageController.getMessageController().sendMessageToMe()
})

// TODO : 과연 이 에러 핸들러는 쓰일 것인가... 404 에러 처리를 하려한다.
app.use(require("./middlewares/errorHandler"))

export default app;
