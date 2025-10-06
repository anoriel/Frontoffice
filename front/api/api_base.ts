import axios from "@/plugins/axios/axios";

export default {
  baseUrl: 'api',
  add(item: object)
  {
    return axios.post(`${this.baseUrl}`, item);
  },
  delete(id: number)
  {
    return axios.delete(`${this.baseUrl}/${id}`)
  },
  export(orderBy: string, orderSort: string, filtersArray: any, isNullArray: any, isNotNullArray: any, properties: any)
  {
    let url = `${this.baseUrl}/export?pagination=false&orderBy[${orderBy}]=${orderSort}`;
    if (filtersArray) {
      for (let i in filtersArray) {
        let filter = filtersArray[i];
        url += `&${filter.key}=${filter.value}`
      }
    }
    if (isNullArray) {
      for (let i in isNullArray) {
        let filter = isNullArray[i];
        url += `&exists[${filter}]=false`
      }
    }
    if (isNotNullArray) {
      for (let i in isNotNullArray) {
        let filter = isNotNullArray[i];
        url += `&exists[${filter}]=true`
      }
    }
    if (properties) {
      for (let i in properties) {
        let filter = properties[i];
        url += `&properties[]=${filter}`
      }
    }
    const config = {
      headers: {
        Accept: "application/json"
      }
    };

    return axios.get(url, config);
  },
  find(id: number)
  {
    return axios.get(`${this.baseUrl}/${id}`);
  },
  findAll(showFullData: boolean = false)
  {
    let url = `${this.baseUrl}?pagination=false`;
    if (showFullData) {
      url += `&showFullData=true`
    }
    return axios.get(`${this.baseUrl}?pagination=false`);
  },
  findPage(page: number, perPage: number, orderBy: string, orderSort: string, filtersArray: any, isNullArray: any, isNotNullArray: any)
  {
    let url = `${this.baseUrl}?page=${page}&itemsPerPage=${perPage}&orderBy[${orderBy}]=${orderSort}`;
    if (filtersArray) {
      for (let i in filtersArray) {
        let filter = filtersArray[i];
        url += `&${filter.key}=${filter.value}`
      }
    }
    if (isNullArray) {
      for (let i in isNullArray) {
        let filter = isNullArray[i];
        url += `&exists[${filter}]=false`
      }
    }
    if (isNotNullArray) {
      for (let i in isNotNullArray) {
        let filter = isNotNullArray[i];
        url += `&exists[${filter}]=true`
      }
    }
    return axios.get(url);
  },
  save(id: number, item: object)
  {
    return axios.patch(`${this.baseUrl}/${id}`, item);
  },
};
