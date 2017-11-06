import './breadcrumbs.scss';
import React, { Component } from 'react';
import { string, object, array } from 'prop-types';
import { IconSmall } from '../';

class Breadcrumbs extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: string,
    path: array,
  }

  state = {
  }

  createBreadcrumbs = () => {
    let filepath = this.props.pathItems;
    filepath.map((group, index) => {
      return ( <li 
          key={index}>
          <IconSmall name='chevron-right' />
          <span>{group.name}</span>
        </li>
      );
    })
  }

  render() {
 	  const { className, style, pathItems, home } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };
    const breadcrumbs = this.createBreadcrumbs();

    return (
      <div className={`breadcrumbs ${className}`}>
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
