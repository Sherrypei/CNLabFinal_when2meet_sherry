import { createStore } from "vuex";
import { instance } from "./api";
import { timeLabelGenerator, getLabelTop, splitToChunks } from "./utils";
import { isEmpty, isNil } from "lodash";

export default createStore({
  state() {
    return {
      eventData: {},
      userName: "lkajsfd",
    };
  },
  mutations: {
    FETCH_AVAILABILITY(state, data) {
      state.eventData = data;
    },
    ADD_AVAILABILITY(state, content) {
      const { unixtime } = content;
      const userName = state.userName;
      if (state.eventData.availability[unixtime].indexOf(userName) === -1) {
        state.eventData.availability[unixtime].push(userName);
      }
    },
    REMOVE_AVAILABILITY(state, content) {
      const { unixtime } = content;
      const userName = state.userName;
      state.eventData.availability.value[
        unixtime
      ] = state.eventData.availability.value[unixtime].filter((val) => {
        return val !== userName;
      });
    },
  },
  actions: {
    async fetchAvailabilities({ commit }, id) {
      const response = await instance.get("60a09733d643c48ee7352d2e");
      commit("FETCH_AVAILABILITY", response.data);
    },
    addEvent({ commit }, payload) {
      commit("ADD_AVAILABILITY", payload);
    },
    removeEvent({ commit }, payload) {
      commit("REMOVE_AVAILABILITY", payload);
    },
  },
  getters: {
    getUserName(state) {
      return state.userName;
    },
    getEventData(state) {
      return state.eventData;
    },
    getAvailability(state) {
      return state.eventData.availability;
    },
    getSplitAvailabilities(state) {
      if (isEmpty(state.eventData)) {
        return;
      }
      const output = splitToChunks(state.eventData.availability, 6);
      return output;
    },
    getEventName(state) {
      return state.eventData.event_name;
    },
    getTimeLabels(state, getters) {
      if (isEmpty(state.eventData)) {
        return [];
      }
      return timeLabelGenerator(getters.getSplitAvailabilities[0]);
    },
    getTopLabel(state, getters) {
      const avail = state.eventData.availability;
      if (isNil(avail)) {
        return;
      }
      return getLabelTop(
        Object.keys(avail)[0],
        Object.keys(avail)[Object.keys(avail).length - 1]
      );
    },
  },
});
