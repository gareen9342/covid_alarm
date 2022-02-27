import {sequelize} from "./sequelize"
import logger from "./../logger/winston"

const EXIT_CODE_SUCCESS = 0;
const EXIT_CODE_FAIL = 1;

const driver = async () => {
  try {
    await sequelize.sync({force: false})
  } catch (err:any) {
    // TODO : 디비 연결이 실패하면 재연결 시도를 할 필요가 있는지에 대해
    // sigint 시그널을 보내는 것은 안된다고 함. 프로그래밍 방시긍로 서버를 종료하는 방법이 있음.
    // process.exit()
    // TODO : https://nodejs.dev/learn/how-to-exit-from-a-nodejs-program 이걸로 수정할 것인가.. 아니면 다른 방법을 시도할 것인가
    logger.error(err.name || "something failed while connecting with database");
    process.exit(EXIT_CODE_SUCCESS)
  }
}

export default driver