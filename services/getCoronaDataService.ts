import axios from "axios";
import {CoronaData} from "../dto/CoronaData";
import logger from "../logger/winston";
import {Injectable} from "@decorators/di";
import CrawlingCoronaDataService from "./crawlingCoronaDataService";

/**
 * 코로나 확진자수 데이터 가져오기
 * @returns {Promise<CoronaData | null>}
 */
@Injectable()
export default class GetCoronaDataService {
  /**
   * 코로나 API를 이용해서 데이터 가져오기
   * @returns {Promise<CoronaData>}
   */
  async getData(): Promise<CoronaData> {

    try {
      logger.info(`searching corona data from API...`)

      const {data: apiData} = await axios.get(`https://api.corona-19.kr/korea/?serviceKey=${process.env.CORONA_API_KEY}`)

      if (!apiData) {
        throw new Error("something failed getting corona data")
      }

      logger.info(`corona data received from api, ${JSON.stringify(apiData)}`)

      return new CoronaData(apiData.TotalCase, apiData.TotalCaseBefore, apiData.updateTime)

    } catch (err) {
      throw err
    }
  }

  /**
   * 크롤링을 이용해서 데이터 가져오기
   * @returns {Promise<CoronaData>}
   */
  async getDataFromCrawler(): Promise<CoronaData> {
    try {

      const crawlingCoronaDataService = new CrawlingCoronaDataService();

      let coronaData = await crawlingCoronaDataService.crawlingBrowserAndReturnCoronaData();

      if (!coronaData) {
        throw new Error("something failed getting corona data")
      }

      return coronaData

    } catch (err) {
      throw err
    }
  }

}
