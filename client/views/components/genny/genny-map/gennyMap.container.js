import { connect } from 'react-redux';
import GennyMap from './GennyMap.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity };
}

export default connect( mapStateToProps, null )( GennyMap );
