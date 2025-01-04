import dotenv from "dotenv";
import express, { NextFunction, urlencoded } from "express"; 
import morgan from "morgan";
import { CustomError, exceptionHandler, routeNotFoundHandler } from "./config/exception-handler";
import { Request, Response } from "express";
import router from "./config/routes";
import { AxiosError } from "axios";

dotenv.config();

export const app = express();

const PORT = process.env.PORT || 3000;  // Asegura un valor por defecto

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.use('/api', router); 
app.use(routeNotFoundHandler);
app.use(exceptionHandler);

app.listen(PORT, () => {
  console.log(`Server running at PORT: ${PORT}`);
}).on('error', (error) => {
  throw new Error(error.message);
});
