import './list.scss';
import React, { Component } from 'react';
import { Pagination, ListItem } from '../';
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

  renderMain = (children, itemsPerPage, hideNav) => {

    if ( children == null || children == false ) {
      return ( <ListItem className='list-empty'>No data to display.</ListItem> );
    } else {
      return (
        <Pagination perPage={itemsPerPage} hideNav={hideNav} >
          {children}
        </Pagination>
      );
    }
  }

  render() {
  
    const { className, style, children, itemsPerPage, header, hideNav } = this.props;
    const { } = this.state;
    const componentStyle = { ...style, };

    //console.log(children);
    
    const renderMain = this.renderMain(children, itemsPerPage, hideNav);

    //console.log(renderMain);

    return (
      <div className={`list ${className}`} style={componentStyle}>
        { header ?
          <div className='list-header'>
            {header}
          </div>
        : null }
        <div className="list-main">
          {renderMain}
        </div>
      </div>
    );
  }
}

export default List;
