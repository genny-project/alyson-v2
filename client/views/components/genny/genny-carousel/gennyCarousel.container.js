import { connect } from 'react-redux';
import GennyCarousel from './GennyCarousel.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity, sublayout: state.layouts.sublayout  }
}

export default connect( mapStateToProps, null )( GennyCarousel );
