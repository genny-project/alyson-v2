import './form.scss';
import React, { Component } from 'react';
import { Pagination, Input } from 'views/components';
import { string, bool, number, array} from 'prop-types';
import { FormGroup } from './form-group';

class Form extends Component {

  static defaultProps = {
    className: '',
    itemsPerPage: 3,
    data: [],
  }

  static propTypes = {
    className: string,
    itemsPerPage: number,
    showProgress: bool,
    data: array,
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
        return (<FormGroup title={questionGroup.title} data={this.renderGroup(questionGroup.content)}/>);
      }
      return [];
  }

  render() {
             /* Forms  Stylesheet starts*/
             const formContainer = { background: '#fff', display: 'flex', justifyContent: 'center', flexGrow: 1 };
             const formMain = { color: '#222', width: 600, marginTop: 50, marginBottom: 50, padding:20 };
             const formFields = { paddingBottom: 10 };
             const formContainerHorizontal = { background: '#999', borderRadius: 5, marginBottom: 10 };
             let   horizontalFormMain = null;
             const horizontalFormFields = { display: 'flex', justifyContent: 'space-between', paddingBottom: 0, flexWrap: 'wrap' };
             const FormFieldsInputText = { marginBottom: '0 !important', flexGrow: 1, padding: 5 };
             const formFieldsInput = { paddingTop: 3, paddingBottom: 3, height: 40, borderRadius: 10 };
            if(isHorizontal){
              horizontalFormMain= { width: '100%', marginTop: 0, marginBottom: 0, padding: 5 };
            }
             /* Forms Stylesheet Ends  */
             const { className, style, itemsPerPage, showProgress, isHorizontal, hideNav, data } = this.props;
             const componentStyle = { ...style };
             let questionGroup = this.renderGroup(data);
             return <div style={{...formContainer,...formContainerHorizontal}}>
                 <div style={formMain}>
                   <div style={formFields}>
                     {!isHorizontal && questionGroup.length > itemsPerPage ? <Pagination perPage={itemsPerPage} hideNav={hideNav}>
                         {questionGroup}
                       </Pagination> : questionGroup}
                   </div>
                 </div>
               </div>;
           }
}

export default Form;