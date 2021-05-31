import * as actionTypes from "../actions/actions";
import {
  CognitoUserPool,
} from "amazon-cognito-identity-js";


const poolData = {
  UserPoolId: process.env.REACT_APP_USERPOOLID, 
  ClientId: process.env.REACT_APP_CLIENTID,
};

const UserPool = new CognitoUserPool(poolData);


const initialState = {
  counter: 0,
  logged_in: false,
  UserPool : UserPool,
  datasource: null,
  last_short_url:"",
};

const myreducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case actionTypes.INCREMENT:
      newState = Object.assign({}, state);
      newState.counter = state.counter + action.value;
      return newState;
    case actionTypes.LOGIN:

        newState = Object.assign({}, state);
        newState.logged_in = true;
        return newState;
    case actionTypes.LOGOUT:
      newState = Object.assign({}, state);
      newState.logged_in = false;
      return newState;
    case actionTypes.LOAD_USERPOOL:
        newState = Object.assign({}, state);
        newState.UserPool = action.UserPool;
        return newState;
    case actionTypes.CHECK_IF_LOGGED_IN:
      newState = Object.assign({}, state);
      newState.logged_in = action.value;
      return newState;
    case actionTypes.LOAD_DATASOURCE:
      newState = Object.assign({}, state);
      newState.datasource = action.datasource;
      newState.last_short_url = action.last_short_url;
      return newState;
    default:
      return state;
  }
};

export default myreducer;
