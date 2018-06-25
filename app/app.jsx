import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Reducer from './reducers';

const Store = createStore(Reducer)

const App = (props) => {
    return(
        <Provider store={Store}>
            {props.children}
        </Provider>
    )
}

export default App;