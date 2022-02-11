import {Controller, Post} from "@decorators/express"
import GetTokenService from "../services/getTokenService"
import GetFriendsService from "../services/getFriendsService"
import express from "express"
import logger from "../logger/winston"
import {Injectable} from "@decorators/di";

@Controller("/kakao")
@Injectable()
export default class KakaoTestController {
  constructor(
      private readonly getTokenService: GetTokenService,
      private readonly getFriendsService: GetFriendsService
  ) {
  }

  @Post("/friends")
  async getFriends(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

      logger.info(`get friends from Kakao`)
      let apiResponse = {}

      const accessToken = await this.getTokenService.getToken()
      if (!accessToken?.length) {
        throw new Error("token is not refreshed")
      }

      await this.getFriendsService.getFriends(accessToken).then(val => {
        apiResponse = val
        logger.debug(`got my friends list from Kakao API, api response = ${JSON.stringify(val)}`)
      })

      res.json({...apiResponse, resultCode: 0})

    } catch (err) {
      next(err)
    }
  }
}