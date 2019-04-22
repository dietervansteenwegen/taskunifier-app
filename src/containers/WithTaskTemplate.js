import { connect } from 'react-redux';
import { filterObjects } from '../utils/CategoryUtils';
import withBusyCheck from '../components/common/WithBusyCheck';

function withTaskTemplate(Component, propertyId = 'taskTemplateId') {
    const mapStateToProps = (state, ownProps) => ({
        busy: state.processes.busy,
        taskTemplate: filterObjects(state.taskTemplates).find(taskTemplate => taskTemplate.id === ownProps[propertyId])
    });

    const mapDispatchToProps = dispatch => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withTaskTemplate;