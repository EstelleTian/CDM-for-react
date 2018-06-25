import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch, HashRouter } from 'react-router-dom'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Reducer from './reducers';
import Bundle from './bundle'
import './fontIcon/index.css';
const Store = createStore(Reducer)

const LoginPage = () => (
    <Bundle load={() => import('./container/loginContainer')}>
        {(LoginPage) => <LoginPage />}
    </Bundle>
)

const HomePage = () => (
    <Bundle load={() => import('./container/homeContainer')}>
        {(HomePage) => <HomePage />}
    </Bundle>
)

const Root = () => (
    <HashRouter>
        <Provider store={Store}>
            <div>
                <Switch>
                    <Route exact path="/" component={LoginPage}/>
                    <Route path="/home" component={HomePage}/>
                    <Redirect to="/"/>
                </Switch>
            </div>
        </Provider>
    </HashRouter>
);

const div = document.createElement('div');
div.id = 'root';
var first=document.body.firstChild;
document.body.insertBefore(div, first);
const dom = document.getElementById('root');

ReactDOM.render(<Root />, dom);
