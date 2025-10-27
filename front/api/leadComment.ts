import axios from "@/plugins/axios/axios";
import api_base from './api_base'
import merge from 'deepmerge-json'
import { LeadComment } from "@/interfaces/leadcomment";

const thisApi = {
  baseUrl: '/lead_comments',

  add(item: LeadComment)
  {
    let formData = new FormData();
    formData.append("lead", item.lead);
    formData.append("comment", item.comment);
    if (item.mediaObjects.length) {
      item.mediaObjects.forEach((file: any) =>
      {
        formData.append('mediaObject[]', file);
      });
    }
    console.log("leadData")
    return axios.post(`${this.baseUrl}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
}

let merged = merge(api_base, thisApi)

export default merged
