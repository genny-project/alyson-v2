import './list.scss';
import React, { Component } from 'react';
import { Pagination } from 'views/components';
import { ListItem } from './list-item';
import { string, bool, number, object, any, array, func } from 'prop-types';

class List extends Component {

  static defaultProps = {
    className: '',
    itemsPerPage: 4,
    hideNav: false,
    hideCount: false,
    countText: 'Items Found',
  }

  static propTypes = {
    hideNav: bool,
    className: string,
    style: object,
    itemsPerPage: number,

    itemHeight: number,
    itemWidth: number,
    itemGap: number,

    hideCount: bool,
    countText: string,
    countStyle: object,
    header: any,
    data: array,
    onClick: func
  }

  state = {
  }

  renderMain = (data, itemsPerPage, hideNav) => {
    const { itemHeight, itemWidth, itemGap, onClick } = this.props;

    if (data && data.length > 0) {
      return (
        <Pagination perPage={itemsPerPage} hideNav={hideNav} >
          {data.map((item, index) => {
            return <ListItem {...item} key={index} itemGap={itemGap} itemWidth={itemWidth} itemHeight={itemHeight} onClick={onClick}/>;
          })}
        </Pagination>
      );
    } else {
      return ( <div className='list-empty'>No data to display.</div> );
    }
  }

  renderCount = (data, countText, countStyle) => {
    if (data && data.length > 0) {
      return (
        <div className='list-count' style={{ ...countStyle }}>
          <span>{data.length} {countText}</span>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {

    const { className, style, data, itemsPerPage, header, hideNav, hideCount, countText, countStyle } = this.props;
    const componentStyle = { ...style, };

    const renderMain = this.renderMain(data, itemsPerPage, hideNav);
    const renderCount = this.renderCount(data, countText, countStyle);

    return (
      <div className={`list ${className}`} style={componentStyle}>
        { header ?
          <div className='list-header'>
            {header}
          </div>
        : null }
        { hideCount ? null :
          renderCount
        }
        <div className="list-main">
          {renderMain}
        </div>
      </div>
    );
  }
}

export default List;
