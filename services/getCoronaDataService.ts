import axios from "axios";
import {CoronaData} from "../dto/CoronaData";

/**
 * 코로나 확진자수 데이터 가져오기
 * @returns {Promise<CoronaData | null>}
 */
const getCoronaDataService: () => Promise<CoronaData | null> = async () => {
  let coronaData: CoronaData | null = null
  try {
    console.log(`getting corona data from API...`)

    const {data: apiData} = await axios.get(`https://api.corona-19.kr/korea/?serviceKey=${process.env.CORONA_API_KEY}`)

    if (apiData) {
      console.log(`## corona data received ${JSON.stringify(apiData)}`)
      coronaData = new CoronaData(apiData.TotalCase, apiData.TotalCaseBefore, apiData.NowCase, apiData.updateTime);
    }

  } catch (err) {
    throw err
  } finally {
    return coronaData
  }
}

export default getCoronaDataService