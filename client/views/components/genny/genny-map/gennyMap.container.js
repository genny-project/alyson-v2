import { connect } from 'react-redux';
import GennyMap from './GennyMap.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity, sublayout: state.layouts.sublayout };
}

export default connect( mapStateToProps, null )( GennyMap );
