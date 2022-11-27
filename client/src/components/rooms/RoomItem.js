import React, { Fragment } from 'react'
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
      <div className='column column-one'>
        <div className='row-one'>
          <img src={room.language.icon} alt={room.language.label}/>
          <div className='count'>
            <p><i class="fas fa-users"></i> {room.users.length}</p>
          </div>
        </div>
        <h1>
          {room.title}
        </h1>
      </div>
      <div className='column'>
        <strong>
          Language Levels
        </strong>
        {room.language_levels.map(language_level => 
          <p>
            {language_level.label}
          </p>
        )}
      </div>
      <div className='column'>
        <strong>
          Topics
        </strong>
        {room.topics.map(topic => 
          <p>
            {topic.label}
          </p>
        )}
      </div>
      <div className='action-buttons-wrapper'>
        {
          auth && auth.user && auth.user._id
          === adminUser ?
          <Fragment>
            <Link to={`/room/${roomID}`} className='btn btn-primary'>
              Go to Room
            </Link>
            <Link to={`/edit-room/${roomID}`} className='btn bg-light'>
              Edit
            </Link>
            <button
              className="btn btn-danger"
              id={roomID}
              onClick={handleDeleteRoom}
            >
              <i class="fa fa-trash-o"></i> Delete
            </button>
          </Fragment>
          : <Fragment>
              <button  className="btn btn-hidden">Test</button>
              <Link to={`/room/${roomID}`} className='btn btn-primary'>
                Go to Room
              </Link>
              <button  className="btn btn-hidden">Test</button>
          </Fragment>
        }
      </div>
    </div >
  )
}

const mapStateToProps = state => ({
  auth: state.auth
})

RoomItem.propTypes = {

}

export default connect(mapStateToProps, { deleteRoom })(RoomItem)
