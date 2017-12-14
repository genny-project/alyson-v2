import './list.scss';
import React, { Component } from 'react';
import { Pagination } from '../';
import { ListItem } from './list-item';
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

  renderMain = (data, itemsPerPage, hideNav) => {

    if (data) { 
      return (
        <Pagination perPage={itemsPerPage} hideNav={hideNav} >
          {data.map((item, index) => {
            console.log(item);
            return <ListItem {...item} />
          })}
        </Pagination>
      );
    } else {
      return ( <ListItem className='list-empty'>No data to display.</ListItem> );
    } 
  }

  render() {
  
    const { className, style, data, itemsPerPage, header, hideNav } = this.props;
    const { } = this.state;
    const componentStyle = { ...style, };
    console.log('data', data);
    
    const renderMain = this.renderMain(data, itemsPerPage, hideNav);

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
