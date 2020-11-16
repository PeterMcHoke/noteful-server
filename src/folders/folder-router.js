const path = require('path')
const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const FolderService = require('./folder-service')

const folderRouter = express.Router()
const bodyParser = express.json()

const serializeFolder = folder => (
    {
        id: folder.id,
        title: xss(folder.title)
    }
)

folderRouter.route('/folders')

    .get((req, res, next) => {
        FolderService.getAllFolders(req.app.get('db'))
            .then(folders => {
                res.json(folders.map(serializeFolder))
            })
            .catch(next)
    })

    .post(bodyParser, (req, res, next) => {
        const { title } = req.body
        const newFolder = { title }

        if (!newFolder['title']){
            logger.error(`Title is required`)
            return res.status(400).send({
                error: { message: "Title is required" }
            })
        }

        FolderService.insertFolder(
            req.app.get('db'),
            newFolder
        )
            .then(folder => {
                logger.info(`Folder with ${folder.id} was successfully created!`)
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `${folder.id}`))
                    .json(serializeFolder(folder))
            })
            .catch(next)
    })

    .patch(bodyParser, (req, res, next) => {
        const { title } = req.body
        const folderFieldsToUpdate = { title }

        const numberOfValues =
            Object
            .values(folderFieldsToUpdate)
            .filter(Boolean).length

        if (numberOfValues === 0) {
          logger.error(`Invalid update without a title`)
          return res.status(400).json({
            error: {
              message: `Request body must contain a title'`
            }
          })
        }

        FolderService.updateFolder(
            req.app.get('db'),
            req.params.folder_id,
            folderFieldsToUpdate
        )
            .then((numRowsAffected) => {
                res.status(204).end()
            })
            .catch(next)
    })

    module.exports = folderRouter
