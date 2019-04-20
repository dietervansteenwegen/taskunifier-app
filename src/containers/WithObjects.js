import React from 'react';
import { connect } from 'react-redux';
import { filterObjects, filterArchivedObjects } from '../utils/CategoryUtils';
import { addContext, updateContext, deleteContext } from '../actions/ContextActions';
import { addTaskFilter, updateTaskFilter, deleteTaskFilter } from '../actions/TaskFilterActions';
import { addFolder, updateFolder, deleteFolder } from '../actions/FolderActions';
import { addGoal, updateGoal, deleteGoal } from '../actions/GoalActions';
import { addLocation, updateLocation, deleteLocation } from '../actions/LocationActions';
import { updateTag, deleteTag } from '../actions/TaskActions';
import { addTaskTemplate, updateTaskTemplate, deleteTaskTemplate } from '../actions/TaskTemplateActions';
import { getTagsFromTasks } from '../utils/TagUtils';

function withObjects(Component, options = {
    includeActions: false,
    includeContexts: false,
    includeTaskFilters: false,
    includeFolders: false,
    includeGoals: false,
    includeLocations: false,
    includeTags: false,
    includeTaskTemplates: false,
    filterArchivedFolders: false,
    filterArchivedGoals: false
}) {
    function WithObjects(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => {
        const data = {};

        if (options && options.includeContexts === true) {
            data.contexts = filterObjects(state.contexts);
        }

        if (options && options.includeTaskFilters === true) {
            data.taskFilters = filterObjects(state.taskFilters);
        }

        if (options && options.includeFolders === true) {
            data.folders = filterObjects(state.folders);

            if (options.filterArchivedFolders === true) {
                data.folders = filterArchivedObjects(data.folders);
            }
        }

        if (options && options.includeGoals === true) {
            data.goals = filterObjects(state.goals);

            if (options.filterArchivedGoals === true) {
                data.goals = filterArchivedObjects(data.goals);
            }
        }

        if (options && options.includeLocations === true) {
            data.locations = filterObjects(state.locations);
        }

        if (options && options.includeTags === true) {
            data.tags = getTagsFromTasks(state.tasks);
        }

        if (options && options.includeTaskTemplates === true) {
            data.taskTemplates = filterObjects(state.taskTemplates);
        }

        return data;
    };

    const mapDispatchToProps = dispatch => {
        if (!options || options.includeActions !== true) {
            return {};
        }

        return {
            addContext: context => dispatch(addContext(context)),
            updateContext: context => dispatch(updateContext(context)),
            deleteContext: contextId => dispatch(deleteContext(contextId)),
            addTaskFilter: field => dispatch(addTaskFilter(field)),
            updateTaskFilter: field => dispatch(updateTaskFilter(field)),
            deleteTaskFilter: fieldId => dispatch(deleteTaskFilter(fieldId)),
            addFolder: folder => dispatch(addFolder(folder)),
            updateFolder: folder => dispatch(updateFolder(folder)),
            deleteFolder: folderId => dispatch(deleteFolder(folderId)),
            addGoal: goal => dispatch(addGoal(goal)),
            updateGoal: goal => dispatch(updateGoal(goal)),
            deleteGoal: goalId => dispatch(deleteGoal(goalId)),
            addLocation: location => dispatch(addLocation(location)),
            updateLocation: location => dispatch(updateLocation(location)),
            deleteLocation: locationId => dispatch(deleteLocation(locationId)),
            updateTag: (tagId, newTagId) => dispatch(updateTag(tagId, newTagId)),
            deleteTag: tagId => dispatch(deleteTag(tagId)),
            addTaskTemplate: taskTemplate => dispatch(addTaskTemplate(taskTemplate)),
            updateTaskTemplate: taskTemplate => dispatch(updateTaskTemplate(taskTemplate)),
            deleteTaskTemplate: taskTemplateId => dispatch(deleteTaskTemplate(taskTemplateId))
        }
    };

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithObjects);
}

export default withObjects;