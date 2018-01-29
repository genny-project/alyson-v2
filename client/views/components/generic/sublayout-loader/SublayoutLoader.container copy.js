import { connect } from 'react-redux';
import SublayoutLoader from './SublayoutLoader';

function mapStateToProps(state) {
  return { sublayout: state.layouts.sublayout, baseEntity: state.baseEntity.data, };
}

export default connect( mapStateToProps, null )( SublayoutLoader );
