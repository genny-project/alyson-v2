import './list.scss';
import React, { Component } from 'react';
import { Pagination } from '../';
import { string, array, object, number} from 'prop-types';

class List extends Component {

  static defaultProps = {
    className: '',
    itemsPerPage: 3
  }

  static propTypes = {
    className: string,
    itemsPerPage: number,
  }
 
  state = {
    showProgress: this.props.showProgress ? this.props.showProgress : false,
    pageCount: Math.ceil( Object.keys(this.props.children).length / this.props.itemsPerPage ),
    childrenCurrent: 1,
    pageCurrent: 1,
    offset: 0
  }

  getChildrenCount = (childrenCount, itemsPerPage) => {
    const arrChildren = [...Array(childrenCount).keys()].map(x => ++x);
    const arrPage = [];
    let arrPageConvert = arrChildren.map(child => {
      arrPage.push({ child: child, page: Math.ceil(child/itemsPerPage) });
    })
    return arrPage;
  }

  getChildrenForCurrentPage = (itemsPerPage, offset, children) => {
    let displayedItems = children.slice(offset, offset + itemsPerPage);
    return displayedItems;
  }

  pageChange = (selectedPage) => {
    const { itemsPerPage } = this.props; 
    let offset = Math.ceil(selectedPage * itemsPerPage);
    this.setState({offset: offset, pageCurrent: selectedPage + 1}, () => {
    });
  }

  render() {

    const { className, children, style, itemsPerPage, header } = this.props;
    const { childrenCurrent, pageCurrent, pageCount, offset } = this.state;
    const componentStyle = { ...style, };

    let childrenCount = Object.keys(this.props.children).length;
    const childrenPageArray = this.getChildrenForCurrentPage(itemsPerPage, offset, children);

    return (
      <div className={`list ${className}`}>
        <div className='list-header'>
          {header}
        </div>
        <div className="list-main">
          {childrenPageArray}
        </div>
        <div className="list-nav">
          <Pagination perPage={itemsPerPage} totalItems={childrenCount} pageChange={this.pageChange}/>
        </div>
      </div>
    );
  }
}

export default List;
