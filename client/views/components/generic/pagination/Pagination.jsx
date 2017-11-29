import './pagination.scss';
import React, { Component } from 'react';
import { string, object, number, bool } from 'prop-types';
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
  }

  state = {
    pageCount: Math.ceil( Object.keys(this.props.children).length / this.props.perPage ),
    childrenCurrent: 1,
    pageCurrent: 1,
    offset: 0
  }

  getChildrenForCurrentPage = (perPage, offset, children) => {
    let displayedItems = children.slice(offset, offset + perPage);
    return displayedItems;
  }

  handlePageClick = (data) => {
    let selectedPage = data.selected;
    const { perPage } = this.props;
    let offset = Math.ceil(selectedPage * perPage);
    this.setState({offset: offset, pageCurrent: selectedPage + 1}, () => {
    });
  }

  render() {

    const { className, hideNav, children, style, perPage } = this.props;
    const { childrenCurrent, pageCurrent, pageCount, offset } = this.state;
    const componentStyle = { ...style };

    let childrenCount = Object.keys(this.props.children).length;
    const childrenPageArray = this.getChildrenForCurrentPage(perPage, offset, children);

    return (
      <div className={`pagination ${className} ${ hideNav || children <= perPage ? 'hide-nav' : '' } `}>
        <div className='pagination-content'>
          {childrenPageArray}
        </div>
        <ReactPaginate 
          pageCount={this.state.pageCount}
          marginPagesDisplayed={0}
          pageRangeDisplayed={3}
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
