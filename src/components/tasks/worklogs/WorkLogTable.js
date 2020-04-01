import React, { useState } from 'react';
import { Alert, Button } from 'antd';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { v4 as uuid } from 'uuid';
import Icon from 'components/common/Icon';
import Spacer from 'components/common/Spacer';
import CellRenderer from 'components/common/table/CellRenderer';
import { ResizableAndMovableColumn, moveHandler, resizeHandler } from 'components/common/table/ResizableAndMovableColumn';
import { multiSelectionHandler } from 'components/common/table/VirtualizedTable';
import Constants from 'constants/Constants';
import { getWidthForType } from 'data/DataFieldTypes';
import { getWorkLogFields } from 'data/DataWorkLogFields';
import { useAppApi } from 'hooks/UseAppApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { TimerPropType } from 'proptypes/TimerPropTypes';
import { WorkLogPropType } from 'proptypes/WorkLogPropTypes';
import { compareDates } from 'utils/CompareUtils';
import { getWorkLogBackgroundColor } from 'utils/SettingUtils';
import { toStringDuration } from 'utils/StringUtils';
import {
    getDuration,
    getDurationForDay,
    getDurationUntilNow,
    getWorkLogsWithLength,
    getWorkLogsWithTimer
} from 'utils/WorkLogUtils';

function WorkLogTable({ timer, workLogs, updateWorkLogs, updateTotalLength }) {
    const appApi = useAppApi();
    const settingsApi = useSettingsApi();
    const [selectedWorkLogIds, setSelectedWorkLogIds] = useState([]);

    workLogs = [...workLogs];
    workLogs.sort((a, b) => compareDates(a.start, b.start, true));

    const workLogFields = getWorkLogFields(settingsApi.settings);
    const workLogsWithLength = getWorkLogsWithLength(workLogs);
    const workLogsWithTimer = getWorkLogsWithTimer(workLogs, timer, appApi.minuteTimer);

    const total = workLogsWithTimer.reduce((total, workLog) => total + getDuration(workLog), 0);
    const totalToday = workLogsWithTimer.reduce((total, workLog) => total + getDurationForDay(workLog, appApi.minuteTimer), 0);
    const totalUntilNow = workLogsWithTimer.reduce((total, workLog) => total + getDurationUntilNow(workLog, appApi.minuteTimer), 0);

    const onAddWorkLog = () => {
        updateWorkLogs([
            ...workLogs,
            {
                id: uuid()
            }
        ]);
    };

    const onUpdateWorkLog = workLog => {
        workLog = { ...workLog };
        delete workLog.length;

        const index = workLogs.findIndex(item => item.id === workLog.id);
        const newWorkLogs = [...workLogs];
        newWorkLogs[index] = workLog;
        updateWorkLogs(newWorkLogs);
    };

    const onDeleteWorkLogs = workLogIds => {
        const newWorkLogs = workLogs.filter(item => !workLogIds.includes(item.id));
        updateWorkLogs(newWorkLogs);
    };

    const onUpdateTotalLength = () => {
        updateTotalLength(total);
    };

    let tableWidth = 0;

    const onResize = resizeHandler('workLogColumnWidth_', settingsApi.updateSettings);
    const onMove = moveHandler('workLogColumnOrder_', workLogFields, settingsApi.settings, settingsApi.updateSettings);

    const columns = sortBy(workLogFields, field => settingsApi.settings['workLogColumnOrder_' + field.id] || 0).map(field => {
        const settingKey = 'workLogColumnWidth_' + field.id;
        let width = Number(settingsApi.settings[settingKey]);

        if (!width || width < 10) {
            width = getWidthForType(field.type);
        }

        tableWidth += width + 10;

        return (
            <Column
                key={field.id}
                label={field.title}
                dataKey={field.id}
                width={width}
                flexGrow={0}
                flexShrink={0}
                headerRenderer={data => (
                    <ResizableAndMovableColumn
                        dataKey={data.dataKey}
                        label={data.label}
                        sortBy={data.sortBy}
                        sortDirection={data.sortDirection}
                        onResize={data => onResize(data, field.id, width + data.deltaX)}
                        onMove={(dragColumn, dropColumn) => onMove(dragColumn.dataKey, dropColumn.dataKey)} />
                )}
                cellRenderer={({ cellData, rowData }) => (
                    <CellRenderer
                        record={rowData}
                        field={field}
                        value={cellData}
                        onChange={allValues => onUpdateWorkLog({
                            ...rowData,
                            ...allValues
                        })} />
                )} />
        );
    });

    return (
        <React.Fragment>
            <div style={{ overflowY: 'hidden', height: 'calc(100% - 80px)' }}>
                <AutoSizer>
                    {({ height }) => (
                        <Table
                            width={tableWidth}
                            height={height}
                            rowHeight={28}
                            headerHeight={20}
                            rowCount={workLogs.length}
                            rowGetter={({ index }) => workLogsWithLength[index]}
                            rowStyle={({ index }) => {
                                const workLog = workLogs[index];

                                if (!workLog) {
                                    return {};
                                }

                                let foregroundColor = 'initial';
                                let backgroundColor = getWorkLogBackgroundColor(workLog, index, settingsApi.settings);

                                if (selectedWorkLogIds.includes(workLog.id)) {
                                    foregroundColor = Constants.selectionForegroundColor;
                                    backgroundColor = Constants.selectionBackgroundColor;
                                }

                                return {
                                    color: foregroundColor,
                                    backgroundColor
                                };
                            }}
                            onRowClick={multiSelectionHandler(
                                rowData => rowData.id,
                                workLogs,
                                selectedWorkLogIds,
                                setSelectedWorkLogIds)} >
                            {columns}
                        </Table>
                    )}
                </AutoSizer>
            </div>
            <div style={{ marginTop: 10 }}>
                <Button onClick={() => onAddWorkLog()}>
                    <Icon icon="plus" text="Add" />
                </Button>
                <Spacer />
                <Button
                    onClick={() => onDeleteWorkLogs(selectedWorkLogIds)}
                    disabled={selectedWorkLogIds.length === 0}>
                    <Icon icon="trash-alt" text="Delete" />
                </Button>
                <Spacer />
                <Button onClick={() => onUpdateTotalLength()}>
                    <Icon icon="edit" text="Update timer value with total" />
                </Button>
                <Spacer />
                <span>Total: <strong>{toStringDuration(total, false)}</strong></span>
                <Spacer />
                <span>Total until now: <strong>{toStringDuration(totalUntilNow, false)}</strong></span>
                <Spacer />
                <span>Total for today: <strong>{toStringDuration(totalToday, false)}</strong></span>
            </div>
            <Alert
                type={timer && timer.startDate ? 'warning' : 'info'}
                showIcon
                message={timer && timer.startDate ?
                    'The timer is started. The time between the start of the timer and now is included in the total.' :
                    'The timer is paused.'
                }
                style={{ marginTop: 5 }} />
        </React.Fragment>
    );
}

WorkLogTable.propTypes = {
    timer: TimerPropType,
    workLogs: PropTypes.arrayOf(WorkLogPropType.isRequired).isRequired,
    updateWorkLogs: PropTypes.func.isRequired,
    updateTotalLength: PropTypes.func.isRequired
};

export default WorkLogTable;