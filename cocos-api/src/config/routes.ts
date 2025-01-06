import express from "express";
import { InformationControllerInstance, OrderControllerInstance, PortfolioControllerInstance } from "./dependencies";
import Joi from "joi";
import { createCustomError } from "./exception-handler";

const router = express.Router();

router.get("/portfolio", async (req, res, next) => {
  const userId = req.query.userId?.toString();
  try {
    Joi.assert(userId, Joi.string().required());
    res.json(
      await PortfolioControllerInstance.get(parseInt(userId as string))
    );
  } catch (error: any) {
    if (error.details && error.details[0].message !== null && error.details[0]?.message !== undefined) {
      return next(createCustomError(400, error.details[0].message));
    } 
    return next(error); 
  }
});

router.get("/instruments/search", async (req, res, next) => {
  const searchParam = req.query.searchParam?.toString();
  try {
    Joi.assert(searchParam, Joi.string().required());
    res.json(
      await InformationControllerInstance.searchInstrument(searchParam as string)
    );
  } catch (error: any) {
    if (error.details && error.details[0].message !== null && error.details[0]?.message !== undefined) {
      return next(createCustomError(400, error.details[0].message));
    } 
    return next(error);
  }
});

router.post("/orders", async (req, res, next) => {
  const order = req.body;
  try {
    Joi.assert(order, Joi.object({
      userId: Joi.string().required(),
      instrumentId: Joi.string().required(),
      size: Joi.number().required(),
      price: Joi.number().required(),
      side: Joi.string().valid("BUY", "SELL").required(),
      type: Joi.string().valid("MARKET", "LIMIT").required(),
    }).required())
    res.status(202).json(
      await OrderControllerInstance.createOrder(order)
    );
  } catch (error: any) {
    if (error.details && error.details[0].message !== null && error.details[0]?.message !== undefined) {
      return next(createCustomError(400, error.details[0].message));
    } 
    return next(error);
  }
});

export default router;