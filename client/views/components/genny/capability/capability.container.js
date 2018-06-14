import { connect } from 'react-redux';
import Capability from './Capability.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity };
}

export default connect( mapStateToProps, null )( Capability );
