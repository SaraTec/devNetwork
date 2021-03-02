import React, { Fragment, useState } from 'react'
import {Link} from 'react-router-dom'

const Register = () => {
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

    if(password!==password2) {
      console.log("Passwords do not match")
    } else {
/*       const newUser = {
        name,
        email,
        password
      }

      try {
        const config = {
          headers: {
            'Content-Type' : 'application/json'
          }
        }

        const body = JSON.stringify(newUser);
        const res = await axios.post('/api/users', body, config);
        console.log(res.data)
      } catch (error) {
        console.log(error.response.data);
      } */
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
      <form onSubmit = {onSubmit} className="form">
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

export default Register
