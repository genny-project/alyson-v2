import './pagination.scss';
import React, { Component } from 'react';
import { string, object, number, bool, func } from 'prop-types';
import ReactPaginate from 'react-paginate';
import { IconSmall } from '../';

class Pagination extends Component {

  static defaultProps = {
    className: '',
    hidePage: false,
  }

  static propTypes = {
    className: string,
    style: string,
    totalItems: number,
    perPage: number,
    marginPagesDisplayed: number,
    pageRangeDisplayed: number,
    hidePageNumbers: bool,
    pageChange: func,
  }

  state = {
    pageCount: Math.ceil(this.props.totalItems / this.props.perPage),
  }

  handlePageClick = (data) => {
    const { pageChange } = this.props;
    let selected = data.selected;
    if(pageChange) pageChange(selected);
  };

  render() {

    const { className, hidePageNumbers, children, style } = this.props;
    const componentStyle = { ...style };

    return (
      <div className={`pagination ${className} ${hidePageNumbers ? 'hide-pages' : ''}`}>
        <ReactPaginate 
          pageCount={this.state.pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={this.handlePageClick}
          containerClassName="pagination-main"
          pageClassName="pagination-number"
          previousClassName="pagination-prev"
          nextClassName="pagination-next"
          activeClassName="pagination-current"
          breakClassName="pagination-break"
          previousLabel={<IconSmall name='chevron_left' />}
          nextLabel={<IconSmall name='chevron_right' />}
        />
      </div>
    );
  }
}

export default Pagination;
