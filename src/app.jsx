import React from 'react'
import ReactDOM from 'react-dom'
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import Routes from './routes/route'
import './iconfont/iconfont.css'
import './app.less';

const root = document.createElement('div');
root.className = 'root';
document.body.appendChild(root)
ReactDOM.render(
    <LocaleProvider locale={zh_CN}>
        <Routes />
    </LocaleProvider>,
root);
