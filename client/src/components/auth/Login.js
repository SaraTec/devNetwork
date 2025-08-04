import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
  const [FormData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = FormData;

  const onChange = (e) =>
    setFormData({
      ...FormData,
      [e.target.name]: e.target.value,
    });

  const onSubmit = async (e) => {
    console.log('onSubmit');
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Redirect to='/rooms' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i>
        Sign Into Your Account
      </p>
      <form onSubmit={onSubmit} className='form'>
        <div className='form-group'>
          <input
            name={'email'}
            type='email'
            placeholder='Email Address'
            value={email}
            onChange={onChange}
          ></input>
        </div>
        <div className='form-group'>
          <input
            name={'password'}
            type='password'
            placeholder='Password'
            minLength='6'
            value={password}
            onChange={onChange}
          ></input>
        </div>
        <input type='submit' value='Login' className='btn btn-primary'></input>
      </form>
      <p className='my-1'>
        Dont have an account?
        <Link to='register'>Sign Un</Link>
      </p>
    </Fragment>
  );
};

Login.protoTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
