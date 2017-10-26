import './form.scss';
import React, { Component } from 'react';
import { ProgressBar, Button, IconSmall } from '../';
import { string, array, object} from 'prop-types';

class Form extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
  }

  state = {
    itemsPerPage: this.props.itemsPerPage ? this.props.itemsPerPage : 1,
    showProgress: this.props.showProgress ? this.props.showProgress : false,
    pageCount: Math.ceil( Object.keys(this.props.children).length / this.props.itemsPerPage ),
    childrenCurrent: 1,
    pageCurrent: 1,
  }

  handlePrevPage = () => {
    if ( this.state.pageCurrent > 1 ) {
      this.setState(prevState => ({
          pageCurrent: prevState.pageCurrent--
        }, () => {
          console.log(this.state.pageCurrent)
        }),
      );
    }
  }

  handleNextPage = () => {
    if ( this.state.pageCurrent < this.state.childrenCount / this.state.itemsPerPage ) {
      this.setState(prevState => ({
          pageCurrent: prevState.pageCurrent++
        }, () => {
          console.log(this.state.pageCurrent)
        }),
      );
    }
  }

  getChildrenCount = (childrenCount, itemsPerPage) => {
    const arrChildren = [...Array(childrenCount).keys()].map(x => ++x);
    const arrPage = [];
    let arrPageConvert = arrChildren.map(child => {
      arrPage.push({ child: child, page: Math.ceil(child/itemsPerPage) });
    })
    return arrPage;
  }

  getChildrenForCurrentPage = (itemsPerPage) => {
    return [this.props.children]; //TODO: return only children supposed to be displayed
  }

  render() {

    const { className, children, questionGroup, style } = this.props;
    const { itemsPerPage, showProgress, childrenCurrent, pageCurrent, pageCount } = this.state;
    const componentStyle = { ...style, };
    let childrenCount = Object.keys(this.props.children).length;
    const childrenPageArray = this.getChildrenForCurrentPage(itemsPerPage);

    return (
      <div className="form-container">
        <div className="form-main">
          { showProgress && itemsPerPage <= childrenCount ? <ProgressBar progressTotal={pageCount} progressCurrent={pageCurrent} type={1} /> : null }
          <div className="form-fields">
  	        {childrenPageArray}
          </div>
          <div className="form-nav">
            <Button className={`form-nav-prev ${pageCurrent > 1 ? 'visible' : 'hidden' }`} onClick={this.handlePrevPage} >
              <IconSmall name="chevron_left" />
            </Button>
            <Button className={`form-nav-next ${pageCurrent < childrenCount / itemsPerPage ? 'visible' : 'hidden' }`} onClick={this.handleNextPage} >
              <IconSmall name="chevron_right" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Form;
