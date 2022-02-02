module.exports = {
  apps: [{
    name: "covid_alarm",
    script: "./dist/www.js",
    exec_mode: "cluster",
    instance: 1,
    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: "development"
    },
    ignore_watch: ["node_modules"]
  }]
}