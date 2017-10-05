import './form.scss';
import React, { Component } from 'react';
import { Input, ProgressBar, Button, IconSmall } from '../';
import { string, array, object} from 'prop-types';

class Form extends Component {

  static defaultProps = {
    className: '',
    questionGroup: {},
  }

  static propTypes = {
    className: string,
    questionGroup: object,
  }

  state = {
    itemsPerPage: this.props.questionGroup.itemsPerPage ? this.props.questionGroup.itemsPerPage : 1,
    showProgress: this.props.questionGroup.showProgress ? this.props.questionGroup.showProgress : false,
    asks: this.props.questionGroup.asks,
    askCount: this.props.questionGroup.asks.length,
    pageCount: Math.ceil( this.props.questionGroup.asks.length / this.props.questionGroup.itemsPerPage ),
    askCurrent: 1,
    pageCurrent: 1,
  }

  handlePrevPage = () => {
    if ( this.state.pageCurrent > 0 ) {
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
 	  const { className, questionGroup } = this.props;
    const { itemsPerPage, showProgress, asks, askCount, askCurrent, pageCurrent, pageCount } = this.state;
    const askPageArray = this.getAskCount(askCount, itemsPerPage);
    
    return (
      <div className="form">
          { showProgress ? <ProgressBar progressTotal={pageCount} progressCurrent={pageCurrent} type={1} /> : null }
	        {
            asks.map((ask, index) => {
              return pageCurrent === askPageArray[index].page ? <Input key={index} {...ask} /> : null;
            })
	        }
        <div className="form-nav">
            <Button className={`form-nav-prev ${pageCurrent > 0 ? 'visible' : 'hidden' }`} onClick={this.handlePrevPage} >
              <IconSmall name="chevron_left" />
            </Button>
            <Button className={`form-nav-next ${pageCurrent < askCount / itemsPerPage ? 'visible' : 'hidden' }`} onClick={this.handleNextPage} >
              <IconSmall name="chevron_right" />
            </Button>
        </div>
      </div>
    );
  }
}

export default Form;
