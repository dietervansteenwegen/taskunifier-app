import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

export function loadContextsFromFile(file) {
    return loadObjectsFromFile('contexts', file);
}

export function saveContextsToFile(file, data) {
    return saveObjectsToFile('contexts', file, data);
}

export function setContexts(contexts) {
    return setObjects('contexts', contexts);
}

export function addContext(context, options = {}) {
    return addObject('contexts', context, options);
}

export function updateContext(context, options = {}) {
    return updateObject('contexts', context, options);
}

export function deleteContext(contextId) {
    return deleteObject('contexts', contextId);
}

export function cleanContexts() {
    return cleanObjects('contexts');
}