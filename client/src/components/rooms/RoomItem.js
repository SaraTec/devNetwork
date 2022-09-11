import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { v1 as uuid } from "uuid";

const RoomItem = ({
  id = uuid()
}) => {
  return (
    <div className="profile bg-light">
      <Link to={`/room/${id}`} className='btn btn-light'>
        Go to Room
      </Link>
    </div>
  )
}

RoomItem.propTypes = {

}

export default RoomItem
