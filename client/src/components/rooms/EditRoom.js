import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createRoom, getSpecificRoom } from '../../actions/room'
import Select from 'react-select'
import { LANGUGES, LANGUGE_LEVELS, TOPICS } from '../../utils/constants'

const EditRoom = ({ createRoom, getSpecificRoom, history, room: {
  specificRoom, loading
}, match }) => {
  const [formData, setFormData] = useState({})

  useEffect(()=> {
    const roomId = match.params.id;
    if(roomId) {
      getSpecificRoom(roomId);
    } else {
      setFormData({})
    }
  }, [loading, getSpecificRoom]);

  useEffect(() => {
    const roomId = match.params.id;
    if (roomId && specificRoom && !loading) {
      setFormData({
        roomId,
        title: !specificRoom.title ? '' : specificRoom.title,
        desc: !specificRoom.desc ? '' : specificRoom.desc,
        language: !specificRoom.language ? '' : specificRoom.language,
        topics: !specificRoom.topics ? [] : specificRoom.topics,
        language_levels: !specificRoom.language_levels ? [] : specificRoom.language_levels,
      })
    }
  }, [loading, specificRoom])

  const {
    roomId,
    title,
    desc,
    language,
    topics,
    language_levels
  } = formData;

  const onChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    })
  } 

  const onSubmit = e => {
    e.preventDefault();

    createRoom(formData, history, !!roomId)
  }
  return (
    <div className='edit-room'>
      <h1 className="large text-primary">
        {roomId ? "Edit" : "Create"} Your Room
      </h1>
      <p className="lead">
        <i className="fas fa-user"></i>
        Let's get some information to make your room stand out
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="text" placeholder="Title" name="title" value={title} onChange={e => onChange(e)} />
          <small className="form-text">
            Enter the title for your room
          </small>
        </div>
        <div className="form-group">
          <textarea placeholder="Description" name="desc" value={desc} onChange={e => onChange(e)}></textarea>
          <small className="form-text">
            Describe the topic of this conversetions in more words
          </small>
        </div>
        <div className="form-group">
          <Select
            isClearable={true}
            isSearchable={true}
            name="language"
            options={LANGUGES}
            value={language}
            onChange={(newValue) => {
              console.log("newValue = ", newValue)
              onChange({target: {
                name: "language",
                value: newValue
              }})
            }}
          />
          <small className="form-text">
            Give us an idea of where you are at in your career
          </small>
        </div>
        <div className="form-group">
          <Select
            isClearable={true}
            isSearchable={true}
            isMulti
            name="language_levels"
            options={LANGUGE_LEVELS}
            value={language_levels}
            onChange={(newValue) => {
              console.log("newValue = ", newValue)
              onChange({target: {
                name: "language_levels",
                value: newValue
              }})
            }}
          />
          <small className="form-text">
            Select your language level
          </small>
        </div>
        <div className="form-group">
          <Select
            isClearable={true}
            isSearchable={true}
            isMulti
            name="topics"
            options={TOPICS}
            value={topics}
            onChange={(newValue) => {
              onChange({target: {
                name: "topics",
                value: newValue
              }})
            }}
          />
          <small className="form-text">
            Select topic you whould like to tallk about (eg.
            Games of Throns, Tenis )
          </small>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <button className="btn btn-light my-1" onClick={(e)=>{
          e.preventDefault();
          window.history.back()
          }}>Go Back</button>
      </form>
    </div>
  )
}

EditRoom.propTypes = {
  createRoom: PropTypes.func.isRequired,
  getSpecificRoom: PropTypes.func.isRequired,
  room: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  room: state.room
})

export default connect(mapStateToProps, { createRoom, getSpecificRoom })(withRouter(EditRoom));
