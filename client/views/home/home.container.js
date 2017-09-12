import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Home from './Home.jsx';

function mapDispatchToProps( dispatch ) {
  return bindActionCreators({}, dispatch );
}

export default connect( null, mapDispatchToProps )( Home );
