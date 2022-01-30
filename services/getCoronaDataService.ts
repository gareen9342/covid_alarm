import axios from "axios";
import {CoronaData} from "../dto/CoronaData";


/**
 * 코로나 확진자수 데이터 가져오기
 * @returns {Promise<CoronaData>}
 *
 */
const getCoronaDataService = async () => {
  try {
    const {data: apiData} = await axios.get(`https://api.corona-19.kr/korea/?serviceKey=${process.env.CORONA_API_KEY}`)
    if (apiData) {
      console.log(`## corona data received ${JSON.stringify(apiData)}`)
      return new CoronaData(apiData.TotalCase, apiData.TotalCaseBefore, apiData.NowCase, apiData.NowCase);
    }
  } catch (err) {
    throw err
  }
}

export default getCoronaDataService