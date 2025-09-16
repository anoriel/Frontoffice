
import axios from "@/plugins/axios/axios";
import api_base from './api_base'
import merge from 'deepmerge-json'
import { Lead } from "@/interfaces/lead";

const thisApi = {
  baseUrl: '/leads',

  addLeadComment(payload: any)
  {
    let formData = new FormData();
    formData.append("lead", payload.lead);
    formData.append("comment", payload.comment);
    if (payload.attachedFiles.length) {
      payload.attachedFiles.forEach((file: any) =>
      {
        formData.append('mediaObject[]', file);
      });
    }
    return axios.post("/lead_comments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  findItemsByType(leadTypeId: number)
  {
    return axios.get(`${this.baseUrl}?leadType.id=${leadTypeId}`);
  },
  transformIntoProspect(item: Lead)
  {
    return axios.patch(`${this.baseUrl}/transform_into_prospect/${item.id}`, item);
  },
}

let merged = merge(api_base, thisApi)

export default merged
