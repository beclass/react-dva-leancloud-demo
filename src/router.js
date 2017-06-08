import React from 'react';
import { Router, Route } from 'dva/router';
import IndexPage from './routes/IndexPage';

import Users from "./routes/Users.js";
import Pics from "./routes/Pic";


const requireAuth = function (next, replace, cb) {
	if(2==1){
		alert('认证不通过');
		replace('/sys/login');
	}
	cb();
}

function RouterConfig({ history }) {

  return (
    <Router history={history}>
      <Route path="/" component={IndexPage} />
      <Route path="/users" component={Users} />
      <Route path="/pics" component={Pics} onEnter={requireAuth}/>
    </Router>
  );
}

export default RouterConfig;
