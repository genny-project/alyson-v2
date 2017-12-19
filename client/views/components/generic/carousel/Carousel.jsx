import './carousel.scss';
import React, { Component } from 'react';
import { string, any, array, number } from 'prop-types';
import { IconSmall, Card } from 'views/components';
import { CarouselTile, } from './carousel-tile';
import { Grid } from '@genny-project/layson';

class Carousel extends Component {

  static defaultProps = {
    className: '',
    itemHeight: 300,
    itemWidth: 150,
    itemGap: 5,
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
    items: array,

    itemHeight: number,
    itemWidth: number,
    itemGap: number,
  }

  state = {
    currentPosition: 0,
  }

  handleClick = (direction, totalWidth, totalItem) => (event) => {
    console.log('direction', direction);

    if (direction == 'left' ){
      this.setState({
        currentPosition: this.state.currentPosition - totalItem
      })
    } else if (direction == 'right') {
      this.setState({
        currentPosition: this.state.currentPosition + totalItem
      })
    }
    
  }



  renderItems = (items, totalWidth) => {
    const { itemHeight, itemWidth, itemGap } = this.props;
    if (items && items.length > 0) {
      return (
        <div className='carousel-main' position={[0,1]} style={{ width: `${totalWidth}px`, transform: `translateX(-${this.state.currentPosition}px)`  }}> 
          {items.map((item, index) => {
            return (
              <CarouselTile
                {...item} 
                style={{color: "red"}}
                itemGap={itemGap}
                itemWidth={itemWidth}
                itemHeight={itemHeight}
              />
            )
          })}
        </div>
      );
    }
  }

  render() {
 	  const { className, data, style, children, itemWidth, itemGap } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };
    
    const totalItem = itemWidth + (2 * itemGap);
    const totalWidth =  data.length * totalItem;
    console.log('width: ', totalWidth);
    console.log('currentPosition: ', this.state.currentPosition)

    return (
      <div className={`carousel ${className}`}>
        <Grid style={{backgroundColor: "white"}}
          rows={[
            { style: {flexGrow: 1, position: 'relative'}}
          ]}
          cols={[
            { style: {flexGrow: 0, height: '100%', background: 'black', display: 'flex', alignItems: 'center', position: 'absolute', zIndex: '10', left: '0'}},
            { style: {overflow: 'hidden'}},
            { style: {flexGrow: 0, height: '100%', background: 'black', display: 'flex', alignItems: 'center', position: 'absolute', zIndex: '10', right: '0'}}
          ]}
        >
          <IconSmall name="chevron_left" position={[0,0]} className='clickable' onClick={this.handleClick('left', totalWidth, totalItem)}/>
            {this.renderItems(data, totalWidth)}
          <IconSmall name="chevron_right" position={[0,2]} className='clickable' onClick={this.handleClick('right', totalWidth, totalItem)}/>
        </Grid>
      </div>
    );
  }
}

export default Carousel;
