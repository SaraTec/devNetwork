import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'
import PropTypes from 'prop-types'

const Register = ({ setAlert, register }) => {
  const [FormData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = FormData;

  const onChange = e => setFormData({
    ...FormData,
    [e.target.name]: e.target.value
  })

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger', 3000)
    } else {
      register({name, email, password});
    }
  }

  return (
    <Fragment>
      <h1 className="large text-primary">
        Sign Up
      </h1>
      <p className="lead">
        <i className="fas fa-user"></i>
        Create Your Account
      </p>
      <form onSubmit={onSubmit} className="form">
        <div className="form-group">
          <input type="text"
            name={"name"} placeholder="Name" value={name}
            onChange={onChange} required></input>
        </div>
        <div className="form-group">
          <input name={"email"} type="email" placeholder="Email Address" value={email}
            onChange={onChange}></input>
          <small className="form-text">
            This site uses Gravatar. so if you want a profile image, use a Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input name={"password"} type="password" placeholder="Password" minLength="6" value={password}
            onChange={onChange}></input>
        </div>
        <div className="form-group">
          <input name={"password2"} type="password" placeholder="Confirm Password" minLength="6" value={password2}
            onChange={onChange}></input>
        </div>
        <input type="submit" value="Register" className="btn btn-primary"></input>
      </form>
      <p className="my-1">
        Already have an account?
        <Link to="login">
          Sign In
        </Link>
      </p>
    </Fragment>
  )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
}

export default connect(null, { setAlert, register })(Register)
