import { combineReducers } from "redux";

import serverReducer from "./serverReducer";
import countsReducer from "./countsReducer";

export default combineReducers({
  servers: serverReducer,
  counts: countsReducer
});
