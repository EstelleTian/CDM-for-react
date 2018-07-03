import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Reducer from '../redux/reducers'
import Bundle from './bundle'

const Store = createStore(Reducer);
//登录页面
const LoginPage = () => (
    <Bundle load={() => import('../views/Login')}>
        {(LoginPage) => <LoginPage />}
    </Bundle>
)
//主页面
const HomePage = () => (
    <Bundle load={() => import('../views/Home')}>
        {(HomePage) => <HomePage />}
    </Bundle>
)

const Routes = () => (
    <HashRouter>
        <Provider store={Store}>
            <Switch>
                <Route exact path="/" component={ LoginPage } />
                <Route path="/home" component={ HomePage } />
                <Redirect to="/" />
            </Switch>
        </Provider>
    </HashRouter>
)

export default Routes;

