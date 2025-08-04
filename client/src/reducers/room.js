import {
  GET_ROOMS,
  GET_SPECIFIC_ROOM,
  ROOMS_ERROR,
  CLEAR_ROOMS,
} from '../actions/types';

const initialState = {
  rooms: [],
  specificRoom: {},
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_ROOMS:
      return {
        ...state,
        rooms: payload,
        loading: false,
      };
    case GET_SPECIFIC_ROOM:
      return {
        ...state,
        specificRoom: payload,
        loading: false,
      };
    case CLEAR_ROOMS:
      return {
        ...state,
        rooms: null,
      };
    case ROOMS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
