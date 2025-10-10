import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

export const useGlobalStore = defineStore('global', () =>
{
  const backgroundLoadingRequestsCount = ref(0)
  const isBackgroundLoading = ref(false)
  const perPage = ref(parseInt(sessionStorage.getItem("perPage") ?? '20'))
  const perPageOptions = ref([1, 3, 5, 10, 20, 50, 100, 200])
  const showColumnsDialog = shallowRef(false)
  const showFiltersDialog = shallowRef(false)
  const showSettingsDialog = shallowRef(false)

  function setIsBackgroundLoading(val: boolean)
  {
    if (backgroundLoadingRequestsCount.value < 0) {
      backgroundLoadingRequestsCount.value = 0;
    }

    if (val === true) {
      backgroundLoadingRequestsCount.value++;
    } else if (val === false) {
      backgroundLoadingRequestsCount.value--;
    }

    isBackgroundLoading.value = backgroundLoadingRequestsCount.value > 0;
    return true;
  }

  function setPerPage(val: number)
  {
    perPage.value = val;
    sessionStorage.setItem("perPage", perPage.value.toString());
  }

  return {
    backgroundLoadingRequestsCount,
    isBackgroundLoading,
    perPage,
    perPageOptions,
    showColumnsDialog,
    showFiltersDialog,
    showSettingsDialog,

    setIsBackgroundLoading,
    setPerPage
  }
})
