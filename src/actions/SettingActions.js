import { loadFromFile, saveToFile } from '../utils/ActionUtils';

export const loadSettingsFromFile = (file, core = false) => {
    return (dispatch, getState) => {
        return dispatch(loadFromFile('settings', file, data => dispatch(setSettings(data, core))));
    };
};

export const saveSettingsToFile = (file, data) => {
    return saveToFile('settings', file, data);
};

export const setSettings = (settings, core = false) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_SETTINGS',
            core: core,
            settings: settings,
        });

        return Promise.resolve();
    };
};

export const updateSettings = settings => {
    return (dispatch, getState) => {
        dispatch({
            type: 'UPDATE_SETTINGS',
            settings: settings
        });

        return Promise.resolve();
    };
};