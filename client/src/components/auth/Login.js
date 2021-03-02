import React, { Fragment, useState } from 'react'
import {Link} from 'react-router-dom'

const Login = () => {
  const [FormData, setFormData] = useState({
    email: '',
    password: '',
  });

  const {  email, password } = FormData;

  const onChange = e => setFormData({
    ...FormData,
    [e.target.name]: e.target.value
  })

  const onSubmit = async e => {
    e.preventDefault();
    console.log("SUCCES")
  }

  return (
    <Fragment>
      <h1 className="large text-primary">
        Sign In
      </h1>
      <p className="lead">
        <i className="fas fa-user"></i>
        Sign Into Your Account
      </p>
      <form onSubmit = {onSubmit} className="form">
        <div className="form-group">
          <input name={"email"} type="email" placeholder="Email Address" value={email}
            onChange={onChange}></input>
        </div>
        <div className="form-group">
          <input name={"password"} type="password" placeholder="Password" minLength="6" value={password}
            onChange={onChange}></input>
        </div>
        <input type="submit" value="Login" className="btn btn-primary"></input>
      </form>
      <p className="my-1">
        Dont have an account? 
        <Link to="register">
          Sign Un
        </Link>
      </p>
    </Fragment>
  )
}

export default Login
