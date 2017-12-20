// import './breadcrumbs.scss';
import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { IconSmall } from '../';

class Breadcrumbs extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: object,
    currentPath: string,
  }

  state = {
  }

  createBreadcrumbs = () => {

    let stringPath = this.props.currentPath;
    if(stringPath && stringPath.length > 0) {

        if(stringPath[stringPath.length - 1] == '/') {
            stringPath = stringPath.slice(0, -1);
        }

        let filepath = stringPath.split('/');
        return filepath.map((path, index) => {

            if(path && path.length > 0) {

                return (

                    <li key={index} onClick={() => this.props.onClick(path)}>
                        <IconSmall name='chevron_right' />
                        <span>{path}</span>
                    </li>
                );
            }
        });
    }

    return null;
  }

  render() {
             /* Styles start */
             const breadcrumbsCss = { height: 40, width: '100%', display: 'flex', alignItems: 'center' };
             const breadcrumbsMain = { display: 'flex', marginTop: 0, marginBottom: 0, padding: 0 };
             const li = { display: 'flex', alignItems: 'center', paddingRight: 10, cursor: 'pointer' };
             const span = { fontSize: '0.8em' };
             const iEle = { padding: 0, color: 'white' };
             /* Styles ends here */

             const { className, style, home } = this.props;
             const componentStyle = { ...style };
             const breadcrumbs = this.createBreadcrumbs();

             return <div className={`breadcrumbs ${className}`} style={{ ...breadcrumbsCss, ...componentStyle }}>
                 <ul className="breadcrumbs-main" style={{ ...breadcrumbsMain, ... {listStyleType:'none' }}}>
                   <li className="breadcrumbs-home" style={{...li}}>
                     <IconSmall name="home" style={iEle}/>
                     <span style={{...span}}>Home</span>
                   </li>
                   {breadcrumbs}
                 </ul>
               </div>;
           }
}

export default Breadcrumbs;
