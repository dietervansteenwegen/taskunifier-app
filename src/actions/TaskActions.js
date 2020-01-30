import moment from 'moment';
import {
    addObject,
    cleanObjects,
    deleteObject,
    duplicateObject,
    loadObjectsFromFile,
    loadObjectsFromServer,
    saveObjectsToFile,
    setObjects,
    updateObject
} from 'actions/ObjectActions';
import Constants from 'constants/Constants';
import { getSettings } from 'selectors/SettingSelectors';

export function loadTasksFromFile(file) {
    return loadObjectsFromFile('tasks', file);
}

export function saveTasksToFile(file, data) {
    return saveObjectsToFile('tasks', file, data);
}

export function loadTasksFromServer() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());
        const completedAfter = moment().subtract(settings.loadTasksCompletedAfter, 'month').toISOString();
        return await dispatch(loadObjectsFromServer('tasks', null, { completedAfter }));
    };
}

export function setTasks(tasks) {
    return setObjects('tasks', tasks);
}

export function addTask(task, options = {}) {
    return addObject('tasks', task, options, {
        title: '',
        color: Constants.defaultObjectColor,
        text: ''
    });
}

export function duplicateTask(task, options = {}) {
    return duplicateObject('tasks', task, options);
}

export function updateTask(task, options = {}) {
    return updateObject('tasks', task, options);
}

export function deleteTask(taskId, options = {}) {
    return deleteObject('tasks', taskId, options);
}

export function cleanTasks() {
    return cleanObjects('tasks');
}

export function undoTaskStateUpdate() {
    return async dispatch => {
        dispatch({
            type: 'TASK_UNDO'
        });
    };
}

export function redoTaskStateUpdate() {
    return async dispatch => {
        dispatch({
            type: 'TASK_REDO'
        });
    };
}