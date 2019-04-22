import { connect } from 'react-redux';
import { updateSettings } from '../actions/SettingActions';
import withBusyCheck from '../components/common/WithBusyCheck';

function withSettings(Component) {
    const mapStateToProps = state => ({
        busy: state.processes.busy,
        settings: state.settings
    });

    const mapDispatchToProps = dispatch => ({
        updateSettings: task => dispatch(updateSettings(task))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withSettings;