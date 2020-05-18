import React from 'react';
import { Input, Modal, message } from 'antd';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { resetData } from 'actions/AppActions';
import { updateSettings } from 'actions/SettingActions';
import { updateProcess } from 'actions/ThreadActions';
import { getToodledoAccountInfo } from 'actions/synchronization/toodledo/ToodledoAccountInfoActions';
import { authorize, createToken, refreshToken } from 'actions/synchronization/toodledo/ToodledoAuthorizationActions';
import { synchronizeContexts } from 'actions/synchronization/toodledo/ToodledoContextActions';
import { synchronizeFolders } from 'actions/synchronization/toodledo/ToodledoFolderActions';
import { synchronizeGoals } from 'actions/synchronization/toodledo/ToodledoGoalActions';
import { synchronizeLocations } from 'actions/synchronization/toodledo/ToodledoLocationActions';
import { synchronizeNotes } from 'actions/synchronization/toodledo/ToodledoNoteActions';
import { synchronizeTasks } from 'actions/synchronization/toodledo/ToodledoTaskActions';
import { getSettings } from 'selectors/SettingSelectors';

async function getAuthorizationCode() {
    return new Promise((resolve, reject) => {
        let code = null;

        Modal.confirm({
            title: 'Enter authorization code',
            content: (
                <Input onChange={event => code = event.target.value} />
            ),
            okText: 'Continue',
            onOk: () => {
                resolve(code);
            },
            onCancel: () => {
                reject('The connection to Toodledo has been cancelled');
            },
            width: 500
        });
    });
}

export function synchronizeWithToodledo() {
    return async (dispatch, getState) => {
        const processId = uuid();

        try {
            let settings = getSettings(getState());

            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: 'Synchronize with Toodledo',
                notify: true
            }));

            if (!settings.toodledo || !settings.toodledo.accessToken || !settings.toodledo.refreshToken) {
                message.info('Opening Toodledo\'s website... Please log into your account and enter the authorization code.', 10);

                await dispatch(authorize());
                const code = await getAuthorizationCode();
                await dispatch(createToken(code));

                settings = getSettings(getState());
            }

            const accessTokenCreationDate = moment(settings.toodledo.accessTokenCreationDate);
            const expirationDate = moment(accessTokenCreationDate).add(settings.toodledo.accessTokenExpiresIn, 'second');

            if (moment().diff(expirationDate, 'second') > -60) {
                await dispatch(refreshToken());
            }

            const startTime = moment();

            await dispatch(getToodledoAccountInfo());

            await dispatch(synchronizeContexts());
            await dispatch(synchronizeFolders());
            await dispatch(synchronizeGoals());
            await dispatch(synchronizeLocations());

            await dispatch(synchronizeNotes());
            await dispatch(synchronizeTasks());

            console.debug(`Synchronization completed in ${moment().diff(startTime, 'second')} seconds`);

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            console.error(error);

            if (error.response) {
                console.error(error.response);
            }

            if (error.response && error.response.data && error.response.data.errorCode === 102) {
                await dispatch(updateSettings({
                    toodledo: null
                }));
            }

            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
        }
    };
}

export function resetDataForToodledoSynchronization() {
    return resetData({
        resetContexts: true,
        resetFolders: true,
        resetGoals: true,
        resetLocations: true,
        resetNotes: true,
        resetTasks: true
    });
}