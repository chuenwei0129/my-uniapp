
const SEARCH_GOODS_HISTORY = 'search_goods_history';
export const searchHistoryState = {

  state: {
    historyList: [],
  },

  mutations: {
    setSearchHistory (state, list) {
      console.log('setSearchHistory: ', list);
      console.log('state: ', state);
      state.historyList = list;
      console.log('state: ', state);
    },

  },

  actions: {
    getSearchHistory (context) {
      console.log('getSearchHistory');
      // 添加 记录
      const list = uni.getStorageSync(SEARCH_GOODS_HISTORY);
      context.commit('setSearchHistory', list ?? []);
    },

    addSearchHistory (context, keyword) {
      console.log('addSearchHistory');
      const current = context.state.historyList ?? [];
      let newHistoryList = Array.from(new Set([keyword, ...current]));
      if (newHistoryList.length > 10) {
        newHistoryList = newHistoryList.slice(0, 10);
      }
      context.commit('setSearchHistory', newHistoryList);
      uni.setStorageSync(SEARCH_GOODS_HISTORY, newHistoryList);
    },

    clearSearchHistory (context) {
      console.log('clearSearchHistory');

      context.commit('setSearchHistory', []);
      uni.clearStorageSync('SEARCH_GOODS_HISTORY');
    }
  }
}