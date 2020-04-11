import _ from "lodash";

import { FETCH_SERVERS, FETCH_SERVER } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_SERVERS:
      console.log(action.payload);
      return { ...state, servers: action.payload };
    default:
      return state;
  }
};
