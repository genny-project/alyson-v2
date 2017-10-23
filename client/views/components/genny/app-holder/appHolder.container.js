import { connect } from 'react-redux';
import AppHolder from './AppHolder';

function mapStateToProps(state) {
  return { layout: state.layouts }
}

export default connect( mapStateToProps, null )( AppHolder );
