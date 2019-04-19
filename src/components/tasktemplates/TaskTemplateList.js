import React from 'react';
import PropTypes from 'prop-types';
import { Button, List } from 'antd';
import Icon from '../common/Icon';
import LeftRight from '../common/LeftRight';
import { createAction, createActions } from '../../utils/CategoryListUtils';
import Spacer from '../common/Spacer';
import Constants from '../../constants/Constants';

function TaskTemplateList(props) {
    const defaultTaskTemplate = props.settings['default_task_template'];

    const setDefaultTaskTemplate = () => {
        props.updateSettings({
            default_task_template: props.selectedTaskTemplateId
        });
    }

    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.taskTemplates}
                style={{ minHeight: 400, maxHeight: 400, overflowY: "auto" }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onTaskTemplateSelection(item)}
                        className={item.id === props.selectedTaskTemplateId ? 'selected-list-item' : null}>
                        <LeftRight right={createActions(item, () => props.addTaskTemplate(item), () => props.deleteTaskTemplate(item.id))}>
                            {defaultTaskTemplate === item.id ? createAction(
                                'star',
                                `"${item.title}" is the default task template`,
                                null,
                                Constants.defaultTaskTemplateColor
                            ) : null}
                            <Spacer />
                            <Icon icon="circle" color={item.color} text={item.title} />
                        </LeftRight>
                    </List.Item>
                )}
            />
            <Button onClick={() => props.addTaskTemplate()} style={{ marginTop: 5 }}>
                <Icon icon="plus" text="Add" />
            </Button>
            <Spacer />
            <Button onClick={() => setDefaultTaskTemplate()} style={{ marginTop: 5 }}>
                <Icon icon="star" text="Set as default" />
            </Button>
        </React.Fragment>
    );
}

TaskTemplateList.propTypes = {
    taskTemplates: PropTypes.array.isRequired,
    selectedTaskTemplateId: PropTypes.string,
    addTaskTemplate: PropTypes.func.isRequired,
    deleteTaskTemplate: PropTypes.func.isRequired,
    onTaskTemplateSelection: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired
};

export default TaskTemplateList;