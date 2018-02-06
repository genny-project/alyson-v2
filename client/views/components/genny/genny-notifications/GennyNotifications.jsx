import './gennyNotifications.scss';
import React, { Component } from 'react';
import { Dropdown, IconSmall, GennyList } from 'views/components';
import { string, bool, object } from 'prop-types';
import { BaseEntityQuery } from 'utils/genny';

class GennyNotifications extends Component {

  static defaultProps = {
    iconName: 'notifications',
    root: 'GRP_NOTIFICATIONS'
  };

  static propTypes = {
    isOpen: bool,
    iconName: string,
    className: string,
    style: object,
    root: string
  };

  state = {
  }

  

  render() {

    const { isOpen, iconName, className, root } = this.props;

    const children = BaseEntityQuery.getEntityChildren(root);
    const childCount = children.length > 0 ? children.length : false;

    return (
      <div className={`genny-notifications ${className}`}>
        <Dropdown
          open={isOpen}
          onBlur={this.props.handleBlur}
          tabIndex='-1'
          noAnimation
          header={
            <div className='notifications-header-main' onClick={this.props.onHeaderClick}>
              { 
                childCount ?
                  <div className='notifications-badge badge error'>
                    {childCount}
                  </div>
                : null
              }
              <IconSmall
                className='clickable'
                name={iconName}
                style={{marginRight: '10px', color: 'white'}}
              />
            </div>
          }
        >
          <GennyList root={root} showEmpty />
        </Dropdown>
      </div>
    );
  }
}

export default GennyNotifications;
