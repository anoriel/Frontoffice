import axios from "@/plugins/axios/axios";

export default {
  baseUrl: null,
  add(item: object)
  {
    return axios.post(`${this.baseUrl}`, item);
  },
  delete(id: number)
  {
    return axios.delete(`${this.baseUrl}/${id}`)
  },
  findAll()
  {
    return axios.get(`${this.baseUrl}?pagination=false`);
  },
  find(id: number)
  {
    return axios.get(`${this.baseUrl}/${id}`);
  },
  save(id: number, item: object)
  {
    return axios.patch(`${this.baseUrl}/${id}`, item);
  },
};
