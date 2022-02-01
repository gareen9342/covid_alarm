import express from "express";
import logger from "../logger/winston";

module.exports = (err: express.Errback, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err) {
    logger.error(err)
  }
  res.status(500).send({error: 'Something failed!'});
}