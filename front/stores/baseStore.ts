import api_base from '@/api/api_base';
import { Item } from '@/interfaces/item';

const error: any = null;
const item: Item|null = null;
const list: Item[] = [];

export const baseStore = {
  api: api_base,
  currentPage: 1,
  isLoading: false,
  error,
  item,
  list,
  listLength: 0,

  hasError() { return this.error !== null; },
  hasItems() { return this.list && this.list.length > 0; },

  async delete(id: number)
  {
    this.isLoading = true;
    this.error = null;
    try {
      await this.api.delete(id);
      this.isLoading = false;
      this.item = null;
      return true;
    } catch (error) {
      this.isLoading = false;
      this.error = error;
      return false;
    }
  },
  async findAll()
  {
    this.isLoading = true;
    this.error = null;
    this.list = [];
    this.listLength = 0;
    try {
      let response = await this.api.findAll();
      this.list = response.data["member"];
      this.listLength = response.data["totalItems"];
      this.isLoading = false;
      return response.data;
    } catch (error) {
      this.isLoading = false;
      this.error = error;
      return null;
    }
  },
  async find(id: number)
  {
    this.isLoading = true;
    this.error = null;
    this.item = null;
    try {
      let index = null;
      if (Array.isArray(id)) {
        index = id[0];
        id = id[1];
      }
      let response = await this.api.find(id);
      this.isLoading = false;
      if (index != null) {
        this.item = [index, response.data];
      } else {
        this.item = response.data;
      }
      return response.data;
    } catch (error) {
      this.isLoading = false;
      this.error = error;
      return null;
    }
  },
  getById(id: Number)
  {
    return this.list.find(e => e.id == id)
  },
  reset()
  {
    this.isLoading = false;
    this.error = null;
    this.list = [];
    this.listLength = 0;
    return true;
  },
  async save(id: number, item: any)
  {
    this.isLoading = true;
    this.item = null;
    this.error = null;
    try {
      //#region properties rewriting
      for (let key in item) {
        let property = item[key];
        if (property != null && typeof (property) == "object" && '@id' in property) {
          property = property['@id'];
        } else if (property != null && Array.isArray(property)) {
          for (let p2 in property) {
            if (property[p2] != null && typeof (property[p2]) == "object" && '@id' in property[p2]) {
              property[p2] = property[p2]['@id'];
            }
          }
        }
        item[key] = property;
      }
      //#endregion

      if (item.id && parseInt(item.id) > 0) {
        let response = await this.api.save(id, item)
        this.isLoading = false;
        this.item = response.data;
        return response.data;
      } else {
        let response = await this.api.add(item);
        this.isLoading = false;
        this.item = response.data;
        return response.data;
      }
    } catch (error) {
      this.isLoading = false;
      this.error = error;
      return null;
    }
  },
  resetError()
  {
    this.error = null;
  }
}
