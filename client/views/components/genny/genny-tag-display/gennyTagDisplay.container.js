import { connect } from 'react-redux';
import GennyTagDisplay from './GennyTagDisplay.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity };
}

export default connect( mapStateToProps, null )( GennyTagDisplay );
