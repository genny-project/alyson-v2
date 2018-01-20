import { connect } from 'react-redux';
import GennyRouter from './GennyRouter.jsx';
import { appStart } from 'views/actions/app.actions';
import { authLoggedIn } from 'views/actions/keycloak.actions';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => ({
  layouts: state.layouts,
});

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({ appStart, authLoggedIn }, dispatch);
// }

export default connect(mapStateToProps, null, null, { pure: false })(GennyRouter);
