import axios from "@/plugins/axios/axios";
import api_base from './api_base'
import merge from 'deepmerge-json'
import { FileImportationErrorInterface } from "@/interfaces/FileImportationErrorInterface";

const thisApi = {
  baseUrl: '/oss_integrations',
  findAll()
  {
    return axios.get(
      `${this.baseUrl}?deleted=0&orderBy[createdAt]=desc&orderBy[id]=desc`
    );
  },
  findPage(page: number, perPage: number, _orderBy: string, _orderSort: string, _filtersArray: any, _isNullArray: any, _isNotNullArray: any)
  {
    let url = `${this.baseUrl}?deleted=0&page=${page}&itemsPerPage=${perPage}&orderBy[createdAt]=desc&orderBy[id]=desc`;
    return axios.get(url);
  },
  getFileLinesDetail(id: number)
  {
    let url = "integration/getLinesDetail/" + id;
    return axios.get(url);
  },
  getTotals(id: number)
  {
    let url = "/oss/getTotals/" + id;
    return axios.get(url);
  },
  getTotalsByPeriod(id: number, period: string)
  {
    let url = `/oss/getTotalsByPeriod/${id}/${period}`;
    return axios.get(url);
  },
  setColumns(id: number, validatedColumnsList: FileImportationErrorInterface[])
  {
    return axios.patch("/oss/validateColumns/" + id, { validatedColumnsList: validatedColumnsList, });
  },
  setReplacements(id: number, dataErrorsList: FileImportationErrorInterface)
  {
    return axios.patch("/oss/replacements/" + id, { dataErrorsList: dataErrorsList, });
  },
}

let merged = merge(api_base, thisApi)

export default merged


// export default {
//   getIntegration(id)
//   {
//     let url = "/api/oss_integrations/" + id;
//     return axios.get(url);
//   },
//   getFileLinesDetail(id)
//   {
//     let url = "/api/integration/getLinesDetail/" + id;
//     return axios.get(url);
//   },
//   getTotals(id)
//   {
//     let url = "/api/oss/getTotals/" + id;
//     return axios.get(url);
//   },
//   getTotalsByPeriod(id, period)
//   {
//     let url = `/api/oss/getTotalsByPeriod/${id}/${period}`;
//     return axios.get(url);
//   },
//   sendNewFile(payload)
//   {
//     let formData = new FormData();
//     formData.append("customerId", payload.customer.id);
//     formData.append("invoiceConditionId", payload.invoiceCondition.id);
//     formData.append("fileToImport", payload.fileToImport);
//     formData.append("fiscalDateFromColumn", payload.fiscalDateFromColumn);
//     if (payload.fiscalDateFromColumn == false)
//     {
//       formData.append("period", payload.period.year + '-' + payload.period.monthIndex.toString().padStart(2, '0'));
//     }
//     return axios.post("/api/oss/import", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//   },
//   setColumns(id, validatedColumnsList)
//   {
//     return axios.patch("/api/oss/validateColumns/" + id, {
//       validatedColumnsList: validatedColumnsList,
//     });
//   },
// };
