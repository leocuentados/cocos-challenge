import axios from "axios";
import { environment } from "./constants";

export const initListener = async () => {
    await axios.get(`${environment.url}/healthcheck`)
}