import React, { Fragment, useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { filterRooms } from '../../actions/room'
import Select from 'react-select'
import { LANGUGES, LANGUGE_LEVELS, TOPICS } from '../../utils/constants'

const FilterRoom = ({ filterRooms}) => {
  const [formDate, setFormDate] = useState({})

  const {
    language,
    topics,
    language_levels
  } = formDate;

  const onChange = e => {
    setFormDate({
      ...formDate, [e.target.name]: e.target.value
    })
  } 

  const onSubmit = e => {
    e.preventDefault();

    filterRooms(formDate)
  }
  return (
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <Select
            isClearable={true}
            isSearchable={true}
            name="language"
            options={LANGUGES}
            value={language}
            onChange={(newValue) => {
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
        <input type="submit" className="btn btn-primary my-1" value="Apply filters"/>
      </form>
  )
}

FilterRoom.propTypes = {
  filterRooms: PropTypes.func.isRequired
};

export default connect(null, { filterRooms })(withRouter(FilterRoom));
