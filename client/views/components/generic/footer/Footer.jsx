import React from 'react';
import './footer.scss';
function Footer() {
  return (
    <div className="footer">
      {this.props.children}
    </div>
  );
}

export default Footer;