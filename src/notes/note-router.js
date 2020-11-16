const path = require('path')
const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const NoteService = require('./note-service')

const noteRouter = express.Router()
const bodyParser = express.json()

const serializeNote = note => (
    {
        id: note.id,
        name: xss(note.note_name),
        content: xss(note.content),
        folderId: note.folder_id,
        modified: note.modified
    }
)

noteRouter
    .route('/notes')

    .get((req,res,next) => {
        NoteService.getAllNotes(req.app.get('db'))
            .then( notes => {
                res.json(notes.map(serializeNote))
            })
            .catch(next)
    })

    .post(bodyParser, (req, res, next) => {
        const { name, folderId, content } = req.body
        const note = { name, folderId, content}

        NoteService.insertNote(req.app.get('db'), note)
            .then( note => {
                console.log(note, req.originalUrl)
                logger.info(`Note with id ${note.id} was created`)
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `${note.id}`))
                    .json(serializeNote(note))
            })
            .catch(next)
    })

noteRouter.route('/note/:id')
    .delete((req,res,next)=> {
        const { id } = req.params

        NoteService.deleteNote(
            req.app.get('db'),
            id
        )
        .then(numRowsAffected => {
            logger.info(`Note with id ${id} deleted.`)
            res.status(204).end()
          })
          .catch(next)
    })



module.exports = noteRouter
