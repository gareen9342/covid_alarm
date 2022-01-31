import {Response, Params, Controller, Get, attachControllers, Post, Next} from '@decorators/express';
import {Injectable} from '@decorators/di';
import SendMessageService from "../services/sendMessageService"
import GetCoronaDataService from "../services/getCoronaDataService";
import GetTokenService from "../services/getTokenService";
import dateUtils from "../util/dateUtils";

@Controller('/messages')
@Injectable()
export default class UsersController {

  constructor(
      private readonly sendMessageService: SendMessageService,
      private readonly getCoronaDataService: GetCoronaDataService,
      private readonly getTokenService: GetTokenService
  ) {
  }

  @Post('/')
  async getData(@Response() res, @Next() next) {
    try {
      const accessToken = await this.getTokenService.getToken()
      if (!accessToken?.length) {
        throw new Error("token is not refreshed")
      }
      const coronaData = await this.getCoronaDataService.getData()
      if (coronaData) {
        const sendMessageService = new SendMessageService();
        await sendMessageService.send(accessToken, `
          ${dateUtils.getTodayDate()}의 코로나 확진자 수
  
          * * * * * * * * * *
          - 어제의 확진자수: ${coronaData.totalCaseBefore}
          - 전체 확진자수: ${coronaData.totalCase}
          - 현재 확진자수: ${coronaData.nowCase}
          (기준 업데이트 시간: ${coronaData.updateTime})
        `)
      }
    } catch (err) {
      next(err)
    } finally {
      res.send("send message succeed");
    }

  }
}