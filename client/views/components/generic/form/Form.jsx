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
    itemsPerPage: this.props.questionGroup.itemsPerPage ,
    showProgress: this.props.questionGroup.showProgress,
    asks: this.props.questionGroup.asks,
    askCount: this.props.questionGroup.asks.length,
    askCurrent: 1,
    pageCurrent: 1,
  }

  handleNextAsk = () => {
    if ( this.state.askCurrent < this.state.askCount ) {
      this.setState(prevState => ({
          askCurrent: prevState.askCurrent++
        }, () => {
          console.log(this.state.askCurrent)
        }),
      );
    }
  }

  handleNextPage = () => {
    
  }

  render() {
 	  const { questionGroup } = this.props;
    const { itemsPerPage, showProgress, asks, askCount, askCurrent, pageCurrent } = this.state;
    return (
      <div className="form">
        <ProgressBar nodeCount={askCount} currentNode={askCurrent} />
      	<form>
	        {
            asks.map((ask, index) => {
              console.log(askCurrent, index + 1, itemsPerPage, pageCurrent);
              this.handleNextPage();
              return askCurrent === index + 1 ? <Input key={index} {...ask} /> : null;
            })
	        }
         
  	    </form>
        <div onClick={this.handleNextAsk} >
            <IconSmall name="chevron_right" />
          </div>
      </div>
    );
  }
}

export default Form;
