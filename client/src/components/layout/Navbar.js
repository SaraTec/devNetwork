import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth'

export const Navbar = ({ isAuthenticated, loading, logout }) => {
  const authLinks = (
    <ul>
      <li><Link onClick={logout} to="#">
        <i className="fas fa-sign-out-alt"></i>
        <span className='hide-sm'>Logout</span>
      </Link></li>
    </ul>
  );

  const guesLinks = (
    <ul>
      <li><Link to="#">Developers</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  )
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/"> <i className="fas fa-code"></i>DevConnector </Link>
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
