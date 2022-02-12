import {Response, Params, Controller, Get, attachControllers, Post, Next} from '@decorators/express';
import SendMessageService from "../services/sendMessageService"
import GetCoronaDataService from "../services/getCoronaDataService";
import GetTokenService from "../services/getTokenService";
import dateUtils from "../util/dateUtils";
import logger from "../logger/winston"
import {Injectable} from "@decorators/di";
import ClientResponse from "../dto/ClientResponse";
import GetFriendsService from "../services/getFriendsService";

@Controller('/messages')
// @ts-ignore
@Injectable()
export default class MessageController {

  constructor(
      private readonly sendMessageService: SendMessageService,
      private readonly getCoronaDataService: GetCoronaDataService,
      private readonly getTokenService: GetTokenService,
      private readonly getFriendsService: GetFriendsService
  ) {
  }

  // TODO: static method 하나 만드려고 이렇게 했는데 이게 맞는지 모르겠당...
  /**
   * messageController의 메서드를 static 하게 접근하게 하고 싶어 생성자 따로 만듬... (cron job 떄문에)
   * @returns {MessageController}
   */
  static getMessageController() {
    return new this(
        new SendMessageService(),
        new GetCoronaDataService(),
        new GetTokenService(),
        new GetFriendsService()
    )
  }

  /**
   * 나에게 확진자 정보를 전송하기
   * @returns {Promise<void>}
   */
  async sendMessageToMe(): Promise<void> {
    try {
      logger.info("start sending message to me")
      const accessToken = await this.getTokenService.getToken()
      const coronaData = await this.getCoronaDataService.getDataFromCrawler()
      if (coronaData) {
        await this.sendMessageService.send(accessToken, ` ${dateUtils.getTodayDate()}의 코로나 확진자 수\n\n - 어제의 확진자수: ${coronaData.totalCaseBefore}\n - 전체 확진자수: ${coronaData.totalCase} \n\n(기준 업데이트 시간: ${coronaData.updateTime}) `)
      }

    } catch (err) {
      throw err
    }

  }

  async sendToMeFriends(): Promise<void> {
    try {
      logger.info(`start sending message to friends`)
      const accessToken = await this.getTokenService.getToken()

      const uuidArr = await this.getFriendsService.getFriends(accessToken)
      const coronaData = await this.getCoronaDataService.getDataFromCrawler()
      const message =` ${dateUtils.getTodayDate()}의 코로나 확진자 수\n\n - 어제의 확진자수: ${coronaData.totalCaseBefore}\n - 전체 확진자수: ${coronaData.totalCase} \n\n(기준 업데이트 시간: ${coronaData.updateTime}) `

      await this.sendMessageService.send(
          accessToken,
          message
      )

      await this.sendMessageService.sendToFriends(
        accessToken,
        message,
        uuidArr
      )
    } catch (err) {
      throw err
    }
  }
  @Post('/friends')
  async sendFriends(@Response() res, @Next() next) {
    try {
      await this.sendToMeFriends()
      res.json(new ClientResponse(0))
    } catch (err) {
      next(err);
    }
  }

  @Post('/')
  async send(@Response() res, @Next() next) {
    try {
      await this.sendMessageToMe()
      res.json(new ClientResponse(0))
    } catch (err) {
      next(err);
    }
  }


}