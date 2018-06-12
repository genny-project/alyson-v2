import './spinner.scss';
import React, { Component } from 'react';
import { MoonLoader, BarLoader } from 'react-spinners';

class Spinner extends Component {

  renderLoader() {

      const { loaderType, text } = this.props;

      switch(loaderType) {

          case "bar":
              return (
                  <div>
                      <BarLoader {...this.props} />
                      {
                          text ? <p>{text}</p> : null
                      }
                  </div>
              )
          default:
              return (
                 <div>
                     <MoonLoader color="#0288D1" {...this.props} />
                     {
                         text ? <p>{text}</p> : null
                     }
                 </div>
              );
      }
  }

  render() {

    return (
        <div className="spinner" style={this.props.style}>
          {this.renderLoader()}
        </div>
    )
  }
}

export default Spinner;
