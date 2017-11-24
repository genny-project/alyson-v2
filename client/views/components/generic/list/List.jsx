import './list.scss';
import React, { Component } from 'react';
import { Pagination } from '../';
import { string, bool, number} from 'prop-types';

class List extends Component {

  static defaultProps = {
    className: '',
    itemsPerPage: 3,
    hideNav: false,
  }

  static propTypes = {
    hideNav: bool,
    className: string,
    itemsPerPage: number,
  }

  state = {
  }

  render() {
  
    const { className, children, style, itemsPerPage, header, hideNav } = this.props;
    const { } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`list ${className}`} style={componentStyle}>
        { header ?
          <div className='list-header'>
            {header}
          </div>
        : null }
        <div className="list-main">
          <Pagination perPage={itemsPerPage} hideNav={hideNav} >
              {children}
          </Pagination>
        </div>
      </div>
    );
  }
}

export default List;
