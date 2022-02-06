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
   * @returns {Promise<null | CoronaData>}
   */
  async getData() {
    let coronaData: CoronaData | null = null
    try {
      logger.info(`searching corona data from API...`)

      const {data: apiData} = await axios.get(`https://api.corona-19.kr/korea/?serviceKey=${process.env.CORONA_API_KEY}`)

      if (apiData) {
        logger.info(`corona data received from api, ${JSON.stringify(apiData)}`)
        coronaData = new CoronaData(apiData.TotalCase, apiData.TotalCaseBefore, apiData.updateTime);
      }

    } catch (err) {
      throw err
    } finally {
      return coronaData
    }

  }

  /**
   * 크롤링을 이용해서 데이터 가져오기
   * @returns {Promise<null | CoronaData>}
   */
  async getDataFromCrawler() {
    let coronaData: CoronaData | null = null
    try {
      const crawlingCoronaDataService = new CrawlingCoronaDataService();
      coronaData = await crawlingCoronaDataService.crawlingBrowserAndReturnCoronaData();
    } catch (err) {
      throw err
    } finally {
      return coronaData
    }
  }

}
