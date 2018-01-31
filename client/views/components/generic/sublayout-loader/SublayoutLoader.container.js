import { connect } from 'react-redux';
import SublayoutLoader from './SublayoutLoader';

function mapStateToProps(state) {
  return { sublayouts: state.layouts.sublayout, baseEntity: state.baseEntity.data, };
}

export default connect( mapStateToProps, null )( SublayoutLoader );
