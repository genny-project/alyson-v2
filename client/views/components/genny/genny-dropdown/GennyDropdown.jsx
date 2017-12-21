import './gennyDropdown.scss';
import React, { Component, Children } from 'react';
import { object, string, number } from 'prop-types';
import { Dropdown } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';
import { LayoutLoader } from 'utils/genny/layout-loader';

class GennyDropdown extends Component {

    static defaultProps = {
    }

    static propTypes = {
    };

    state = {
    }

    generateHeader = (header) => {

        if (header ){
            if (header.$$typeof ) {
              return header;
            } else if (Array.isArray(header)) {
              let layout = {layout: header};
      
              //use JSON loader instead of Layout loader
              return <LayoutLoader layout={layout} />;
            } else {
              return null;  
            } 
          } else {
            return null;
          }

    }

    render() {

        const { children, header, ...rest } = this.props;
        
        return (
            <Dropdown 
                {...rest}
                header={ this.generateHeader(header) }
            >
                {children}
            </Dropdown>
        );
    }
}

export default GennyDropdown;
