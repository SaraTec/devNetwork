import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth'

export const Navbar = ({ isAuthenticated, loading, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/rooms">
          <i className="fas fa-comments"></i>{' '}
          <span className='hide-sm'>
            Rooms
          </span>
        </Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user"></i>{' '}
          <span className='hide-sm'>
            Dashboard
          </span>
        </Link>
      </li>
      <li><Link onClick={logout} to="#">
        <i className="fas fa-sign-out-alt"></i>
        {' '}
        <span className='hide-sm'>Logout</span>
      </Link></li>
    </ul>
  );

  const guesLinks = (
    <ul>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  )
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/"> <i className="fas fa-thin fa-campground"></i> Speaking club online</Link>
      </h1>
      {
        !loading && (
          <Fragment>
            {isAuthenticated ? authLinks : guesLinks}
          </Fragment>
        )
      }
    </nav>
  )
}

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool,
}

const mapStatetoProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  logout: PropTypes.func.isRequired,
})

export default connect(mapStatetoProps, { logout })(Navbar);
