import {sequelize} from "./sequelize"

const driver = async () => {
  try {
    await sequelize.sync({force: false})
  } catch (err) {
    // TODO: 에러 처리
    console.error(err)
  }
}

export default driver