import { connect } from 'react-redux';
import GennyStatus from './GennyStatus.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity };
}

export default connect( mapStateToProps, null )( GennyStatus );
