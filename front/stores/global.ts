import { defineStore } from 'pinia'

interface State
{
  backgroundLoadingRequestsCount: number
  isBackgroundLoading: boolean
  perPage: number
  perPageOptions: number[]
}

export const useGlobalStore = defineStore('global', {
  state: (): State => ({
    backgroundLoadingRequestsCount: 0,
    isBackgroundLoading: false,
    perPage: parseInt(sessionStorage.getItem("perPage") ?? '20'),
    perPageOptions: [1, 3, 5, 10, 20, 50, 100, 200],
  }),
  actions: {
    setIsBackgroundLoading(val: boolean)
    {
      if (this.backgroundLoadingRequestsCount < 0) {
        this.backgroundLoadingRequestsCount = 0;
      }

      if (val === true) {
        this.backgroundLoadingRequestsCount++;
      } else if (val === false) {
        this.backgroundLoadingRequestsCount--;
      }

      this.isBackgroundLoading = this.backgroundLoadingRequestsCount > 0;
      return true;
    },
    setPerPage(val: number)
    {
      this.perPage = val;
      sessionStorage.setItem("perPage", this.perPage.toString());
    },
  },
})
