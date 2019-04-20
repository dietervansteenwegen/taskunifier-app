import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Calendar } from 'antd';
import { TaskPropType } from '../../../proptypes/TaskPropTypes';
import withTasks from '../../../containers/WithTasks';
import withSettings from '../../../containers/WithSettings';
import Icon from '../../common/Icon';
import { getImportanceColor } from '../../../utils/SettingUtils';
import './TaskCalendar.css';

function TaskCalendar(props) {
    const getCellRender = unit => value => {
        const tasks = props.tasks.filter(task => {
            if (!task.startDate) {
                return false;
            }

            return moment(task.startDate).isSame(value, unit);
        });

        return (
            <ul className="task-list">
                {tasks.map(task => (
                    <li key={task.id}>
                        <Icon
                            spanClassName="task"
                            icon="circle"
                            color={getImportanceColor(task.importance, props.settings)}
                            text={task.title}
                            onClick={() => props.setSelectedTaskIds([task.id])} />
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <Calendar
            dateCellRender={getCellRender('day')}
            monthCellRender={getCellRender('month')}  />
    );
}

TaskCalendar.propTypes = {
    tasks: PropTypes.arrayOf(TaskPropType).isRequired
};

export default withSettings(withTasks(TaskCalendar, { applySelectedTaskFilter: true }));