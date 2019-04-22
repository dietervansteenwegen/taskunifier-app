import moment from 'moment';
import { connect } from 'react-redux';
import { addNote, updateNote, deleteNote } from '../actions/NoteActions';
import { getDefaultNoteFields } from '../data/DataNoteFields';
import { filterObjects } from '../utils/CategoryUtils';
import { applyFilter } from '../utils/FilterUtils';
import { setSelectedNoteIds } from '../actions/AppActions';
import withBusyCheck from '../components/common/WithBusyCheck';

function withNotes(Component, options = { applySelectedNoteFilter: false, actionsOnly: false }) {
    const mapStateToProps = state => {
        if (options && options.actionsOnly === true) {
            return {
                busy: state.processes.busy
            };
        }

        let notes = filterObjects(state.notes);

        if (options && options.applySelectedNoteFilter === true) {
            const fields = getDefaultNoteFields(state.settings).concat(filterObjects(state.noteFields));

            notes = notes.filter(note => {
                if (!state.app.selectedNoteFilterDate ||
                    moment(note.creationDate).isAfter(moment(state.app.selectedNoteFilterDate))) {
                    return true;
                }

                return applyFilter(state.app.selectedNoteFilter, note, fields);
            });
        }

        return {
            busy: state.processes.busy,
            notes: notes
        };
    };

    const mapDispatchToProps = dispatch => ({
        addNote: note => dispatch(addNote(note)),
        updateNote: note => dispatch(updateNote(note)),
        deleteNote: noteId => dispatch(deleteNote(noteId)),
        setSelectedNoteIds: noteIds => dispatch(setSelectedNoteIds(noteIds))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withNotes;