import { connect } from 'react-redux';
import App from './App.jsx';
import { appStart } from 'views/actions/app.actions';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => ({
  keycloak: state.keycloak,
});

function mapDispatchToProps( dispatch ) {
  return bindActionCreators({ appStart }, dispatch );
}

export default connect( mapStateToProps, mapDispatchToProps, null, { pure: false } )( App );
