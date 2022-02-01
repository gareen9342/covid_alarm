import {Response, Params, Controller, Get, attachControllers, Post, Next} from '@decorators/express';
import SendMessageService from "../services/sendMessageService"
import GetCoronaDataService from "../services/getCoronaDataService";
import GetTokenService from "../services/getTokenService";
import dateUtils from "../util/dateUtils";
import logger from "../logger/winston"

@Controller('/messages')
export default class MessageController {

  constructor(
      private readonly sendMessageService: SendMessageService,
      private readonly getCoronaDataService: GetCoronaDataService,
      private readonly getTokenService: GetTokenService
  ) {
  }

  // TODO: static method 하나 만드려고 이렇게 했는데 이게 맞는지 모르겠당...
  /**
   * messageController의 메서드를 static 하게 접근하게 하고 싶어 생성자 따로 만듬... (cron job 떄문에)
   * @returns {MessageController}
   */
  static getMessageController(): MessageController {
    return new this(
        new SendMessageService(),
        new GetCoronaDataService(),
        new GetTokenService()
    )
  }

  /**
   * 나에게 확진자 정보를 전송하기
   * @returns {Promise<void>}
   */
  async sendMessageToMe() {
    try {
      logger.info("start sending message to me")
      const accessToken = await this.getTokenService.getToken()
      if (!accessToken?.length) {
        throw new Error("token is not refreshed")
      }
      const coronaData = await this.getCoronaDataService.getData()
      if (coronaData) {
        await this.sendMessageService.send(accessToken, ` ${dateUtils.getTodayDate()}의 코로나 확진자 수\n* * * * * * * * * *\n - 어제의 확진자수: ${coronaData.totalCaseBefore}\n - 전체 확진자수: ${coronaData.totalCase} \n- 현재 확진자수: ${coronaData.nowCase} \n(기준 업데이트 시간: ${coronaData.updateTime}) `)
      }

    } catch (err) {
      throw err
    }

  }

  @Post('/')
  async send(@Response() res, @Next() next) {
    try {
      await this.sendMessageToMe()
      res.send("send message succeed");
    } catch (err) {
      next(err);
    }
  }
}