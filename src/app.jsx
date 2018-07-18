import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './routes/route'
import './iconfont/iconfont.css'
import './app.less';

const root = document.createElement('div');
root.className = 'root';
document.body.appendChild(root)
ReactDOM.render(<Routes />, root);
