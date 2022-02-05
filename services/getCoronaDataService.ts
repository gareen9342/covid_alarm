import axios from "axios";
import {CoronaData} from "../dto/CoronaData";
import logger from "../logger/winston";
import {Injectable} from "@decorators/di";

/**
 * 코로나 확진자수 데이터 가져오기
 * @returns {Promise<CoronaData | null>}
 */
@Injectable()
export default class GetCoronaDataService {
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
}
