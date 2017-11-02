import './form.scss';
import React, { Component } from 'react';
import { ProgressBar, Button, IconSmall, Pagination } from '../';
import { string, array, object, number} from 'prop-types';

class Form extends Component {

  static defaultProps = {
    className: '',
    itemsPerPage: 3
  }

  static propTypes = {
    className: string,
    itemsPerPage: number,
    showProgress: false
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
    this.setState({offset: offset}, () => {
    });
  }

  render() {

    const { className, children, style, itemsPerPage, showProgress, } = this.props;
    const { childrenCurrent, pageCurrent, pageCount, offset } = this.state;
    const componentStyle = { ...style, };
    
    let childrenCount = Object.keys(this.props.children).length;
    const childrenPageArray = this.getChildrenForCurrentPage(itemsPerPage, offset, children);

    return (
      <div className="form-container">
        <div className="form-main">
          { showProgress && itemsPerPage <= childrenCount ? <ProgressBar progressTotal={pageCount} progressCurrent={pageCurrent} type={1} /> : null }
          <div className="form-fields">
  	        {childrenPageArray}
          </div>
          <div className="form-nav">
            <Pagination hidePageNumbers perPage={itemsPerPage} totalItems={childrenCount} pageChange={this.pageChange}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Form;
