import { connect } from 'react-redux';
import GennyNotifications from './GennyNotifications.jsx';

function mapStateToProps(state) {
  return { notifications: state.notification.data };
}

export default connect( mapStateToProps )( GennyNotifications );
