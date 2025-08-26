import axios from "axios";

let api = {
  axios(){
    return axios;
  },
  baseUrl(){
    return null;
  },
  delete(id){
    return this.axios().delete(`${this.baseUrl()}/${id}`)
  },
  findAll() {
    return this.axios().get(`${this.baseUrl()}?pagination=false`);
  },
  find(id) {
    return this.axios().get(`${this.baseUrl()}/${id}`);
  },
  save(id, item) {
    return this.axios().patch(`${this.baseUrl()}/${id}`, item);
  },
  add(item) {
    return this.axios().post(`${this.baseUrl()}`, item);
  },
};

export default api;