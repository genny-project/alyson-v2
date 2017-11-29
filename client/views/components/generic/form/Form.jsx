import './form.scss';
import React, { Component } from 'react';
import { ProgressBar, Button, IconSmall, Pagination } from '../';
import { string, bool, number} from 'prop-types';

class Form extends Component {

  static defaultProps = {
    className: '',
    itemsPerPage: 3
  }

  static propTypes = {
    className: string,
    itemsPerPage: number,
    showProgress: bool,
  }

  state = {
    showProgress: this.props.showProgress ? this.props.showProgress : false,
  }


  render() {

    const { className, children, style, itemsPerPage, showProgress, isHorizontal, hideNav } = this.props;
    const { } = this.state;
    const componentStyle = { ...style, };

    let childrenCount = Object.keys(this.props.children).length;

    return (
      <div className={`form-container ${isHorizontal ? 'horizontal' : null }`}>
        <div className="form-main">
          <div className="form-fields">
            { !isHorizontal ?
              <Pagination perPage={itemsPerPage} hideNav={hideNav}>
                {children}
              </Pagination>
            : children }
          </div>
        </div>
      </div>
    );
  }
}

export default Form;
