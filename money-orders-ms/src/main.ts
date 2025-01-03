import dotenv from "dotenv";
import "reflect-metadata";
import { DbInstance } from "./config/db";
import express, { Request as ExRequest, Response as ExResponse, NextFunction, urlencoded } from "express"; 
import morgan from "morgan";
import { exceptionHandler, notFoundHandler } from "./config/exception-handler";

export const app = express();
const NODE_ENV = process.env.NODE_ENV;

dotenv.config();

const PORT = process.env.PORT;

async function main() {
  console.log("Initializing server at: ", NODE_ENV);

  await DbInstance.initialize()
  app.use(
    urlencoded({
      extended: true,
    })
  );
  app.use(express.json())
  app.use(morgan("tiny"));

  app.use((_req: ExRequest, res: ExResponse) => notFoundHandler(_req, res))

  app.use((err: unknown, req: ExRequest, res: ExResponse, next: NextFunction) => {
    return exceptionHandler(err, req, res, next);
  })

  app.listen(PORT, () => { 
    console.log("Server running at PORT: ", PORT); 
  }).on("error", (error) => {
    throw new Error(error.message);
  });
}

main();