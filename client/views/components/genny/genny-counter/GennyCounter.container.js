import { connect } from 'react-redux';
import GennyCounter from './GennyCounter.jsx';

function mapStateToProps(state) {
  return {
    baseEntity: state.baseEntity
  };
}

export default connect(mapStateToProps, null)(GennyCounter);
