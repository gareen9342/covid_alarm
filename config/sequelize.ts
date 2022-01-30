import {Sequelize} from "sequelize-typescript"
import {Config} from "../models/Config";

export const sequelize = new Sequelize({
  dialect: 'mysql',
  username: "root",
  password: process.env.MYSQL_DATABASE_PASSWORD,
  database: "covid_alarm",
  storage: ':memory:', // TODO : 이게뭔지
  models: [Config],
})