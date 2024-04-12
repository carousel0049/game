import axios from "axios";

const api = axios.create({ baseURL: "https://https://jsonplaceholder.typicode.com/todos/1" });

api.interceptors.request.use(function (config) {
  return config;
});

export default api;
