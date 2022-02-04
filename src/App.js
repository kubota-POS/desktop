import React, { Component } from 'react';
import { Route, HashRouter } from 'react-router-dom';
import history from './utilities/histroy';

/** Auth Routes */
import LoginPage from './pages/auth/Login';
import LogoutPage from './pages/auth/Logout';

/** General Routes */
import DashboardPage from './pages/Dashboard';
import LandingPage from './pages/Landing';
import LicensePage from './pages/License';
import ErrorPage from './pages/Error';

/** User Routes */
import FirstUserRegisterPage from './pages/user/FirstUserRegister';
import ProfilePage from './pages/user/Profile';

import SettingPage from './pages/Setting';

class App extends Component {

  render() {

    return(
      <HashRouter history={history}>
        <Route exact path={'/'} component={LandingPage} />
        <Route exact path={'/license'} component={LicensePage} />
        <Route exact path={'/dashboard'} component={DashboardPage} />
        <Route exact path={'/error/:status'} component={ErrorPage} />
        <Route exact path={'/user/first'} component={FirstUserRegisterPage} />

        <Route exact path={'/login'} component={LoginPage} />
        <Route exact path={'/logout'} component={LogoutPage} />

        <Route exact path={'/profile'} component={ProfilePage} />
        <Route exact path={'/setting'} component={SettingPage} />
      </HashRouter>
    );
  }
}

export default App;
