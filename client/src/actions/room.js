import axios from 'axios'
import { setAlert } from './alert'

import {
  GET_ROOMS,
  ROOMS_ERROR,
  CLEAR_ROOMS
} from './types'

//Get all rooms
export const getRooms = () => async dispatch => {
  dispatch({
    type: CLEAR_ROOMS
  })
  try {
    const res = await axios.get('/api/room');

    dispatch({
      type: GET_ROOMS,
      payload: res.data
    })

    //console.log("res.data = ", res.data)
  } catch (error) {
    dispatch({
      type: ROOMS_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
}

//Delete room
export const deleteRoom = id => async dispatch => {
  try {
    await axios.delete(`/api/room/${id}`)

    dispatch(getRooms())

    dispatch(setAlert('Room Removed', 'success'))
  } catch (err) {
    dispatch({
      type: ROOMS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}


export const filterRooms = (payload) => async dispatch => {
  dispatch({
    type: CLEAR_ROOMS
  })
  try {
    //маємо передавати в пейлоуді дані для фільтрування
    const res = await axios.get('/api/room');

    //console.log("Відфільтровані кімнати = ", res.data)
    dispatch({
      type: GET_ROOMS,
      payload: res.data
    })
  } catch (error) {
    dispatch({
      type: ROOMS_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
}
