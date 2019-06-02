import { ADD_USER } from '../actions/types';

const initialState = {
  userName: '',
  devices: []
};

const userReducer = (state = initialState, action) => {
  switch(action.type) {
    case ADD_USER:
      return {
        ...state,
        userName: state.userName
      };
    default:
      return state;
  }
}

export default userReducer;