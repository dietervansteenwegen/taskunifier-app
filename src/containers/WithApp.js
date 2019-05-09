import { connect } from 'react-redux';
import {
    loadData,
    saveData,
    setBatchAddTasksManagerOptions,
    setCategoryManagerOptions,
    setNoteFilterManagerOptions,
    setSelectedView,
    setSettingManagerOptions,
    setTaskEditionManagerOptions,
    setTaskFilterManagerOptions,
    setTaskTemplateManagerOptions,
    synchronize
} from 'actions/AppActions';
import {
    backupData,
    cleanBackups
} from 'actions/BackupActions';
import { updateSettings } from 'actions/SettingActions';
import { clearProcesses, setProcessesVisible } from 'actions/ProcessActions';
import { isValidLicense } from 'utils/LicenseUtils';
import withBusyCheck from 'containers/WithBusyCheck';
import { getSettings } from 'selectors/SettingSelectors';
import { getSelectedView, getCategoryManager, getNoteFilterManager, getTaskFilterManager, getTaskTemplateManager, getSettingManager, getBatchAddTasksManager, getTaskEditionManager } from 'selectors/AppSelectors';

function withApp(Component) {
    const mapStateToProps = state => ({
        pro: isValidLicense(getSettings(state).license),
        selectedView: getSelectedView(state),
        categoryManager: getCategoryManager(state),
        noteFilterManager: getNoteFilterManager(state),
        taskFilterManager: getTaskFilterManager(state),
        taskEditionManager: getTaskEditionManager(state),
        taskTemplateManager: getTaskTemplateManager(state),
        settingManager: getSettingManager(state),
        batchAddTasksManager: getBatchAddTasksManager(state)
    });

    const mapDispatchToProps = dispatch => ({
        loadData: () => dispatch(loadData()),
        saveData: options => dispatch(saveData(options)),
        backupData: () => dispatch(backupData()),
        cleanBackups: () => dispatch(cleanBackups()),
        synchronize: () => dispatch(synchronize()),
        setSelectedView: view => dispatch(setSelectedView(view)),
        setCategoryManagerOptions: options => dispatch(setCategoryManagerOptions(options)),
        setNoteFilterManagerOptions: options => dispatch(setNoteFilterManagerOptions(options)),
        setTaskFilterManagerOptions: options => dispatch(setTaskFilterManagerOptions(options)),
        setTaskEditionManagerOptions: options => dispatch(setTaskEditionManagerOptions(options)),
        setTaskTemplateManagerOptions: options => dispatch(setTaskTemplateManagerOptions(options)),
        setSettingManagerOptions: options => dispatch(setSettingManagerOptions(options)),
        setBatchAddTasksManagerOptions: options => dispatch(setBatchAddTasksManagerOptions(options)),
        setProcessesVisible: visible => dispatch(setProcessesVisible(visible)),
        clearProcesses: () => dispatch(clearProcesses()),
        updateSettings: settings => dispatch(updateSettings(settings))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withApp;