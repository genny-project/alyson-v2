import './form.scss';
import React from 'react';
import { GennyComponent } from '../genny-component';
import { Input, ProgressBar, Button, IconSmall } from '../';
import { string, array, object} from 'prop-types';

class Form extends GennyComponent {

  static defaultProps = {
    questionGroup: {},
  }

  static propTypes = {
    questionGroup: object,
  }

  state = {
    itemsPerPage: this.props.questionGroup.itemsPerPage ? this.props.questionGroup.itemsPerPage : 1,
    showProgress: this.props.questionGroup.showProgress,
    asks: this.props.questionGroup.asks,
    askCount: this.props.questionGroup.asks.length,
    pageCount: Math.ceil( this.props.questionGroup.asks.length / this.props.questionGroup.itemsPerPage ),
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
 	  const { questionGroup } = this.props;
    const { itemsPerPage, showProgress, asks, askCount, askCurrent, pageCurrent, pageCount } = this.state;
    const askPageArray = this.getAskCount(askCount, itemsPerPage);
    
    return (
      <div className="form">
        { showProgress ? <ProgressBar nodeCount={pageCount} currentNode={pageCurrent} type={2} /> : null }
        { showProgress ? <ProgressBar nodeCount={pageCount} currentNode={pageCurrent} type={1} /> : null }
      	<div>
	        {
            asks.map((ask, index) => {
              return pageCurrent === askPageArray[index].page ? <Input key={index} {...ask} /> : null;
            })
	        }
  	    </div>
        <div className="form-nav">
            <div className={`form-nav-prev ${pageCurrent > 1 ? 'visible' : 'hidden' } `} onClick={this.handlePrevPage} >
              <IconSmall name="chevron_left" />
            </div>
            <div className={`form-nav-next ${pageCurrent < askCount / itemsPerPage ? 'visible' : 'hidden' } `} onClick={this.handleNextPage} >
              <IconSmall name="chevron_right" />
            </div>
        </div>
      </div>
    );
  }
}

export default Form;
