import './form.scss';
import React, { Component } from 'react';
import { Input, ProgressBar, Button, IconSmall } from '../';
import { string, array, object} from 'prop-types';

class Form extends Component {

  static defaultProps = {
    className: '',
    asks: {}
  }

  static propTypes = {
    className: string,
    asks: object,
  }

  state = {
    itemsPerPage: this.props.itemsPerPage ? this.props.itemsPerPage : 1,
    showProgress: this.props.showProgress ? this.props.showProgress : false,
    asks: this.props.asks,
    pageCount: Math.ceil( Object.keys(this.props.asks).length / this.props.itemsPerPage ),
    askCurrent: 1,
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
    if ( this.state.pageCurrent < this.state.askCount / this.state.itemsPerPage ) {
      this.setState(prevState => ({
          pageCurrent: prevState.pageCurrent++
        }, () => {
          console.log(this.state.pageCurrent)
        }),
      );
    }
  }

  getAskCount = (askCount, itemsPerPage) => {
    const arrAsk = [...Array(askCount).keys()].map(x => ++x);
    const arrPage = [];
    let arrPageConvert = arrAsk.map(ask => {
      arrPage.push({ ask: ask, page: Math.ceil(ask/itemsPerPage) });
    })
    return arrPage;
  }

  render() {

    const { className, questionGroup, asks } = this.props;
    const { itemsPerPage, showProgress, askCurrent, pageCurrent, pageCount } = this.state;
    let askCount = Object.keys(this.props.asks).length;
    const askPageArray = this.getAskCount(askCount, itemsPerPage);

    return (
      <div className="form-container">
        <div className="form-main">
          { showProgress && itemsPerPage <= askCount ? <ProgressBar progressTotal={pageCount} progressCurrent={pageCurrent} type={1} /> : null }
          <div className="form-fields">
  	        {
              Object.keys(asks).map((ask_code, index) => {
                return pageCurrent === askPageArray[index].page ? <Input key={index} ask={asks[ask_code]} /> : null;
              })
  	        }
          </div>
          <div className="form-nav">
              <Button className={`form-nav-prev ${pageCurrent > 1 ? 'visible' : 'hidden' }`} onClick={this.handlePrevPage} >
                <IconSmall name="chevron_left" />
              </Button>
              <Button className={`form-nav-next ${pageCurrent < askCount / itemsPerPage ? 'visible' : 'hidden' }`} onClick={this.handleNextPage} >
                <IconSmall name="chevron_right" />
              </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Form;
