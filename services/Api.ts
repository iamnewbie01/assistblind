import axios, {AxiosInstance} from 'axios';
import { REACT_SERVER_HOST, REACT_PORT } from '../env';
const API_URL: string = `http://${REACT_SERVER_HOST}:${REACT_PORT}`;

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
