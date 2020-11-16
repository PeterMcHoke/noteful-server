const NoteService = {
    getAllNotes(knex) {
        return knex('noteful_notes').select('*')
    },
    getNoteById(knex, id) {
        return knex('noteful_notes').select('*').where({ id }).first()
    },
    getNoteByFolderId(knex, folder_id){
        return knex('noteful_notes').select('*').where({ folder_id })
    },
    insertNote(knex, note){
        const newNote = {
            note_name: note.name,
            folder_id: note.folderId,
            content: note.content
        };
        return knex('noteful_notes')
            .insert(newNote)
            .returning('*')
            .then( rows => {
                return rows[0]
            })
    },
    deleteNote(knex, id) {
        return knex('noteful_notes')
        .where({ id })
        .delete()
    },
    updateNote(knex, id, updatedNoteFields) {
        return knex('noteful_notes')
        .where({ id })
        .update(updatedNoteFields)
    }
}

module.exports = NoteService
