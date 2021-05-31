export const INCREMENT = "INCREMENT";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const LOAD_USERPOOL = "LOAD_USERPOOL";
export const CHECK_IF_LOGGED_IN = "CHECK_IF_LOGGED_IN";
export const LOAD_DATASOURCE = "LOAD_DATASOURCE";

export const increment = (val) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(actualIncrement(val));
    }, 2000);
  };
};

export const actualIncrement = (val) => {
  return {
    type: INCREMENT,
    value: val,
  };
};

export const login = () => {
  return {
    type: LOGIN,
  };
};

export const loadDataSource = (datasource, last_short_url) => {
  return {
    type: LOAD_DATASOURCE,
    datasource: datasource,
    last_short_url: last_short_url,
  };
};

export const checkIfLoggedIn = (userpool) => {
  let logged_in = false;
  if (userpool != null) {
    const user = userpool.getCurrentUser();
    if (user) {
      user.getSession((err, session) => {
        if (err) {
        } else {
          logged_in = true;
        }
      });
    }
  }
  return {
    type: CHECK_IF_LOGGED_IN,
    value: logged_in,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};
