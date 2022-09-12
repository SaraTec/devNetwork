import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'
import { connect } from 'react-redux'
import { getRooms } from '../../actions/room'
import RoomItem from './RoomItem'
import axios from 'axios';

const Rooms = ({ getRooms, room: { rooms, loading } }) => {
  useEffect(() => {
    getRooms();
  }, [getRooms])

  const createRoom = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    console.log("post ")
    const res = await axios.post('/api/room', null, config);

    getRooms();
  }

  return <Fragment>
    {loading ? <Spinner /> : <Fragment>
      <h1 className="large text-primary">
        Rooms
        </h1>
      <p className="lead">
        <i className="fab fa-connectdevelop"></i>
        {" "}Select room to connect
      </p>
      <button className='btn btn-primary my-1' onClick={createRoom}>
        Create Room
      </button>
      <div className="rooms">
        {rooms.length > 0 ? (
          rooms.map(room => (
            <RoomItem key={room._id} room={room} />
          ))
        ) : <h4>No Profies found...</h4>}
      </div>
    </Fragment>}
  </Fragment>

}

Rooms.propTypes = {
  getRooms: PropTypes.func.isRequired,
  room: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  room: state.room
})

export default connect(mapStateToProps, { getRooms })(Rooms)
