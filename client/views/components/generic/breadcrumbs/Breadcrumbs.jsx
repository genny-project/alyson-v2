import './breadcrumbs.scss';
import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { IconSmall } from '../';

class Breadcrumbs extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: string,
    path: string,
  }

  state = {
  }

  createBreadcrumbs = () => {

    let stringPath = this.props.path;
    if(stringPath && stringPath.length > 0) {

        if(stringPath[stringPath.length - 1] == "/") {
            stringPath = stringPath.slice(0, -1);
        }

        let filepath = stringPath.split('/');
        return filepath.map((path, index) => (

            <li
                key={index}>
                <IconSmall name='chevron_right' />
                <span>{path}</span>
            </li>
        ))
    }

    return null;
  }

  render() {

    const { className, style, path, home } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };
    const breadcrumbs = this.createBreadcrumbs();

    return (
      <div className={`breadcrumbs ${className}`} style={componentStyle}>
        <ul className='breadcrumbs-main'>
          <li className='breadcrumbs-home'>
            <IconSmall name='home' />
            <span>{home}</span>
          </li>
          {breadcrumbs}
        </ul>
      </div>
    );
  }
}

export default Breadcrumbs;
