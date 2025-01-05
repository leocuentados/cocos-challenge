import express from "express";
import { PortfolioControllerInstance } from "./dependencies";
import Joi from "joi";
import { createCustomError } from "./exception-handler";

const router = express.Router();

router.get("/portfolio", async (req, res, next) => {
  const userId = req.query.userId?.toString();
  try {
    Joi.assert(userId, Joi.string().required());
    const portfolio = await PortfolioControllerInstance.get(parseInt(userId as string));
    if (!portfolio) {
      res.status(404).send();
    } else {
      res.json(portfolio);
    }
  } catch (error: any) {
    if (error.details && error.details[0].message !== null && error.details[0]?.message !== undefined) {
      return next(createCustomError(400, error.details[0].message));
    } 
    return next(error); 
  }
});

export default router;