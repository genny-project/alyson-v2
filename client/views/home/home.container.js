import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Home from './Home.jsx';

const mapStateToProps = state => ({
   layouts: state.layouts,
   alias: state.baseEntity.aliases,
   baseEntity: state.baseEntity,
});


function mapDispatchToProps( dispatch ) {
  return bindActionCreators({}, dispatch );
}

export default connect( mapStateToProps, mapDispatchToProps )( Home );
