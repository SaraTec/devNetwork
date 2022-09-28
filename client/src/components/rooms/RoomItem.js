import React from 'react'
import { Link } from 'react-router-dom'
import { deleteRoom } from '../../actions/room'
import { connect } from 'react-redux'

const RoomItem = ({
  deleteRoom,
  room,
  auth
}) => {
  const { _id: roomID, adminUser } = room;
  const handleDeleteRoom = () => {
    deleteRoom(roomID)
  }

  return (
    <div className="room-item bg-light">
      <Link to={`/room/${roomID}`} className='btn btn-light'>
        Go to Room
      </Link>
      {
        auth && auth.user && auth.user._id
        === adminUser &&
        <button
          className="btn btn-danger"
          id={roomID}
          onClick={handleDeleteRoom}
        >
        <i class="fa fa-trash-o"></i> Delete
    </button>
      }
    </div >
  )
}

const mapStateToProps = state => ({
  auth: state.auth
})

RoomItem.propTypes = {

}

export default connect(mapStateToProps, { deleteRoom })(RoomItem)
