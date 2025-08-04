import axios from 'axios';
import { setAlert } from './alert';

import {
  GET_ROOMS,
  GET_SPECIFIC_ROOM,
  ROOMS_ERROR,
  CLEAR_ROOMS,
} from './types';

//Get specific rooms
export const getSpecificRoom = (roomId) => async (dispatch) => {
  const res = await axios.get(`/api/room/${roomId}`);

  console.log('res = ', res);

  dispatch({
    type: GET_SPECIFIC_ROOM,
    payload: res.data,
  });
};

//Get all rooms
export const getRooms = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/room');

    dispatch({
      type: GET_ROOMS,
      payload: res.data,
    });

    //console.log("res.data = ", res.data)
  } catch (error) {
    dispatch({
      type: ROOMS_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

export const filterRooms = (formData) => async (dispatch) => {
  dispatch({
    type: CLEAR_ROOMS,
  });
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post('api/room/filter', formData, config);

    dispatch({
      type: GET_ROOMS,
      payload: res.data,
    });
  } catch (error) {
    console.log('ERROR');
    dispatch({
      type: ROOMS_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Create or update room
export const createRoom =
  (formData, history, edit = false) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { title, desc, language, topics, language_levels } = formData;

      if (
        title &&
        desc &&
        language &&
        topics &&
        topics.length &&
        language_levels &&
        language_levels.length
      ) {
        const res = await axios.post('/api/room', formData, config);
        dispatch({
          type: GET_ROOMS,
          payload: res.data,
        });

        dispatch(setAlert(edit ? 'Room Updated' : 'Room Created', 'success'));

        history.push('/rooms');
      } else {
        dispatch(setAlert('All fields are required', 'danger'));
      }
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
    }
  };

//Delete room
export const deleteRoom = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/room/${id}`);

    dispatch(getRooms());

    dispatch(setAlert('Room Removed', 'success'));
  } catch (err) {
    dispatch({
      type: ROOMS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
