import dotenv from "dotenv";
import express, { urlencoded } from "express"; 
import morgan from "morgan";
import { exceptionHandler, routeNotFoundHandler } from "./config/exception-handler";
import router from "./config/routes";

dotenv.config();

export const app = express();

const PORT = process.env.PORT || 3000;

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
