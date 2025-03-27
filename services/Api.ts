import axios, {AxiosInstance} from 'axios';
const API_URL: string = 'http://172.20.10.112:5000';

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
