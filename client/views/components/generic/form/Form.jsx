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

  renderGroup(questionGroup) {

      if(Array.isArray( questionGroup )) {
          return questionGroup.map(group => {
             if(group.content) return this.renderGroup(group);
             return group;
          });
      }
      else if (questionGroup.content) {
          return <FormGroup title={questionGroup.title}>{this.renderGroup(questionGroup.content)}</FormGroup>
      }

      return []
  }

  render() {

    const { className, style, itemsPerPage, showProgress, isHorizontal, hideNav } = this.props;
    let { children } = this.props;

    let questionGroup = this.renderGroup( children );
    return (
      <div className={`form-container ${isHorizontal ? 'horizontal' : null }`}>
        <div className="form-main">
          <div className="form-fields">
            { !isHorizontal && questionGroup.length > itemsPerPage ?
              <Pagination perPage={itemsPerPage} hideNav={hideNav}>
                {questionGroup}
              </Pagination>
            : questionGroup }
          </div>
        </div>
      </div>
    );
  }
}

export default Form;
