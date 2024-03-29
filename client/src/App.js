
import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Alert from './components/layout/Alert'
import Dashboard from './components/dashboard/Dashboard'
import CreateProfile from './components/profile-forms/CreateProfile'
import EditProfile from './components/profile-forms/EditProfile'
import AddExperience from './components/profile-forms/AddExperience'
import AddEducation from './components/profile-forms/AddEducation'
import Profiles from './components/profiles/Profiles'
import Profile from './components/profile/Profile'
import PrivateRoute from './components/routing/PrivateRoute';
import setAuthToken from './utils/setAuthToken'
//Redux
import { Provider } from 'react-redux'
import store from './store'
import { loadUser } from './actions/auth'

import './scss/style.scss';
import Rooms from './components/rooms/Rooms';
import Room from './components/room/Room';
import EditRoom from './components/rooms/EditRoom';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <Alert />
          <Switch>
            <PrivateRoute exact path="/room/:id" component={Room} />
            <Route>
              <section className="container">
                <Switch>
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/profiles" component={Profiles} />
                  <Route exact path="/profile/:id" component={Profile} />
                  <PrivateRoute exact path="/rooms" component={Rooms} />
                  <Route exact path="/edit-room/:id" component={EditRoom} />
                  <PrivateRoute exact path="/add-room" component={EditRoom} />
                  <PrivateRoute exact path="/dashboard" component={Dashboard} />
                  <PrivateRoute exact path="/create-profile" component={CreateProfile} />
                  <PrivateRoute exact path="/edit-profile" component={EditProfile} />
                  <PrivateRoute exact path="/add-experience" component={AddExperience} />
                  <PrivateRoute exact path="/add-education" component={AddEducation} />
                </Switch>
              </section>
            </Route>
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  )
}
export default App;
