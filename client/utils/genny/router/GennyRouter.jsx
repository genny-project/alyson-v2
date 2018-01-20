import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';


class GennyRouter extends Component {
  componentDidMount() {

  }

  componentWillReceiveProps( nextProps ) {
    console.log( nextProps );

    if ( this.props.layouts.currentView && nextProps.layouts.currentView ) {
      if ( this.props.layouts.currentView.code !== nextProps.layouts.currentView.code ) {
        // this.props.history.push( `/${nextProps.layouts.currentView.code}&${nextProps.layouts.currentView.dataCode}` );
      }
    }

    if ( this.props.location.pathname !== nextProps.location.pathname ) {
      // this.props.dispatch({ type: 'CMD_VIEW', payload: {
      //   code: nextProps.location.pathname.replace( '/', '' ),
      //   cmd_type: 'CMD_VIEW',
      // } });
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter( GennyRouter );
