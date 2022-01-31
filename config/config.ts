import {Config} from "../models/Config";

/**
 * database 에서 global 변수 세팅하는 함수
 * @returns {Promise<void>}
 */
// TODO : typescript에서 global 변수 세팅하는 법
const initData = async () => {

  // 초기값을 환경변수에 세팅 되어져 있는 값이 있다면 그대로 가지고 온다.
  // global.refreshToken = "";
  // console.log(`setting refresh Token from database...`)
  // await Config.findOne({where: {key: "refreshToken"}, raw: true})
  //     .then(config => {
  //       if (config?.value) {
  //         global.refreshToken = config?.value
  //       }
  //     }).catch(err => {
  //       console.log(err)
  //     })
}

export default initData