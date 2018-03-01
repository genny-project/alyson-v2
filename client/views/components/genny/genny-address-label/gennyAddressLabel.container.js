import { connect } from 'react-redux';
import GennyAddressLabel from './GennyAddressLabel.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity };
}

export default connect( mapStateToProps, null )( GennyAddressLabel );
