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

      let friendsList: Array<string> = []
      logger.info(`get friends from Kakao`)

      const accessToken = await this.getTokenService.getToken()
      if (!accessToken?.length) {
        throw new Error("token is not refreshed")
      }

      friendsList = await this.getFriendsService.getFriends(accessToken)

      logger.debug(`got my friends list from Kakao API, api response = ${JSON.stringify(friendsList)}`)

      res.json({friendsList, resultCode: 0})

    } catch (err) {
      next(err)
    }
  }
}