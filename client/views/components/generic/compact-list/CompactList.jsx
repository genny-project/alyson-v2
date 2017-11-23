import './compactList.scss';
import React, { Component } from 'react';
import { List, IconSmall } from '../';
import { string, array,} from 'prop-types';

class CompactList extends Component {

  static defaultProps = {
    className: '',
    items: [
      { name: 'one',
        last: 'asdasd',
        asjdjasd: 'asdhaskdh',
      },
      { name: 'asd',
        last: 'BBBB',
        asjdjasd: 'SDHSSD',
      },
      { name: 'jnfgfn',
        last: 'olilklk',
        asjdjasd: 'vvxccxvxcv',
      }
    ]
  }

  static propTypes = {
    className: string,
    items: array,
  }
 
  state = {
    isOpen: false,
  }

  onClick = () => {
    this.setState({
      isOpen : !this.state.isOpen
    })
  }

  render() {

    const { className, style, items } = this.props;
    const { isOpen } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`compact-list ${className} ${isOpen ? 'open': null}`} style={componentStyle} onClick={this.onClick}>
        <List hideNav>
          {items.map((item, index) => {
            if ( isOpen || !isOpen && index === 0) {
              let array = [];
              console.log(item);
              Object.keys(item).map((attribute, index) => {
                console.log(attribute);
                array.push(<span>{item[attribute]}</span>)
              })
              return <div className='compact-list-item'>{array}</div>
            }
          })}
        </List>
        {/*<IconSmall className='clickable' onClick={this.onClick} name={ isOpen ? 'expand_less' : 'chevron_right' } />*/}
      </div>
    );
  }
}

export default CompactList;
