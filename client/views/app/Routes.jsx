import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import {
	Home,
	NotFound,
} from 'views';


class Routes extends Component {

	render() {
		return (
			<Switch>
				<Route path="/:layout/:subLayout" exact component={Home} />
				<Route path="/:layout" exact component={Home} />
				<Route component={Home} />
			</Switch>
		);
	}
}

export default Routes;
