import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'
import { connect } from 'react-redux'
import { getRooms } from '../../actions/room'
import { Link } from 'react-router-dom'
import RoomItem from './RoomItem'
import FilterRoom from './FilterRoom'

const Rooms = ({ getRooms, room: { rooms, loading } }) => {
  const [isFilter, setFilteres] = useState(false)

  useEffect(() => {
    getRooms();
  }, [getRooms])

  return (
      <div className='rooms-wrapper'>
      <h1 className="large text-primary">
        Rooms
        </h1>
      <p className="lead">
        <i className="fab fa-connectdevelop"></i>
        {" "}Select room to connect
      </p>
      <Link to='/add-room' className='btn btn-primary create-room'>
        Create Room
      </Link>
      <button className='btn btn-light' onClick={()=> 
        setFilteres(!isFilter)
      }>
        Filter
      </button>
      {isFilter && <FilterRoom />}
      {loading ? <Spinner /> :
        <div className="rooms">
          {rooms && rooms.length > 0 ? (
            rooms.map(room => (
              <RoomItem key={room._id} room={room} />
            ))
          ) : <h4>No Rooms found...</h4>}
        </div>
      }
  </div>)
}

Rooms.propTypes = {
  getRooms: PropTypes.func.isRequired,
  room: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  room: state.room
})

export default connect(mapStateToProps, { getRooms })(Rooms)
