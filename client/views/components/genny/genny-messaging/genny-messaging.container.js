import { connect } from 'react-redux';
import GennyMessaging from './GennyMessaging';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity, sublayout: state.layouts.sublayout  };
}

export default connect( mapStateToProps, null )( GennyMessaging );
