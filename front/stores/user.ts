import { defineStore } from 'pinia'
import UserAPI from '@/api/user'
import { baseStore } from "./baseStore";

let extendedValues = {
  ...baseStore,
  api: UserAPI,
  currentlyLoggedUsersCount: 0,
  currentlyLoggedUsersList: [],
  currentlyLoggedUsersListLength: 0,
  filteredList: [],
  filteredListLength: 0,

  async refreshAll()
  {
    this.error = null;
    try {
      let response = await this.api.findAll();
      this.list = response.data["member"];
      this.listLength = response.data["totalItems"];
      return response.data;
    } catch (error) {
      this.isLoading = false;
      this.error = error
      return null;
    }
  },
  reset()
  {
    this.isLoading = false;
    this.item = null;
    this.error = null;
    this.list = [];
    this.listLength = 0;
    this.filteredList = [];
    this.filteredListLength = 0;
    return true;
  },
  async findByRole(role: string)
  {
    this.isLoading = true;
    this.error = null;
    this.filteredList = [];
    this.filteredListLength = 0;
    try {
      let response = await this.api.findBy(false, role);
      this.isLoading = false;
      this.filteredList = response.data["member"];
      this.filteredListLength = response.data["totalItems"];
      return response.data;
    } catch (error) {
      this.isLoading = false;
      this.error = error;
      return null;
    }
  },
  async getCurrentlyLoggedUsers()
  {
    this.isLoading = true;
    this.error = null;
    this.currentlyLoggedUsersList = [];
    this.currentlyLoggedUsersListLength = 0;
    try {
      let response = await this.api.getCurrentlyLoggedUsers();
      this.isLoading = false;
      this.error = null;
      this.currentlyLoggedUsersList = response.data["member"];
      this.currentlyLoggedUsersListLength = response.data["totalItems"];
      return response.data;
    } catch (error) {
      this.isLoading = false;
      this.error = error;
      return null;
    }
  },
  async getNumberOfCurrentlyLoggedUsers()
  {
    this.isLoading = true;
    this.error = null;
    this.currentlyLoggedUsersCount = 0;
    try {
      let response = await this.api.getNumberOfCurrentlyLoggedUsers();
      this.isLoading = false;
      this.error = null;
      this.currentlyLoggedUsersCount = response.data;
      return response.data;
    } catch (error) {
      this.isLoading = false;
      this.error = error;
      return null;
    }
  },
}

export const useUserStore = defineStore('user', () => extendedValues)
