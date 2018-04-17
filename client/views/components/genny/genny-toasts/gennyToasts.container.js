import { connect } from 'react-redux';
import GennyToasts from './GennyToasts.jsx';

function mapStateToProps(state) {
  return { layout: state.layouts  };
}

export default connect( mapStateToProps, null )( GennyToasts );
