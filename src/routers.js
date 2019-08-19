import React from 'react';
import {browserHistory as history, Router, Route} from 'react-router';
import {LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import ReactDOM from 'react-dom';

import { Input } from 'antd';

function loadRoute(cb) {
    return (module) => cb(null, module.default);
}

const Root = () => (
    <LocaleProvider locale={zhCN}>
        <Router history={history} >
            <Route path="/index" component={Input}>

            </Route>
        </Router>
    </LocaleProvider>
)

ReactDOM.render(<Root />, document.getElementById('root'));