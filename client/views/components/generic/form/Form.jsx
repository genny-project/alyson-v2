import './form.scss';
import React, { Component } from 'react';
import { ProgressBar, Button, IconSmall, Pagination } from 'views/components';
import { string, bool, number} from 'prop-types';
import { FormGroup } from './form-group';

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

    let groups = children ? children.content.map(child => <FormGroup>{child}</FormGroup>) : []

    return (
      <div className={`form-container ${isHorizontal ? 'horizontal' : null }`}>
        <div className="form-main">
          <div className="form-fields">
            { !isHorizontal && groups.length > itemsPerPage ?
              <Pagination perPage={itemsPerPage} hideNav={hideNav}>
                {groups}
              </Pagination>
            : groups }
          </div>
        </div>
      </div>
    );
  }
}

export default Form;
