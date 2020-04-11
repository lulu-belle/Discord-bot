import _ from "lodash";

import { FETCH_SERVER } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_SERVER:
      console.log(action.payload);
      return { ...state, counts: action.payload };
    default:
      return state;
  }
};
