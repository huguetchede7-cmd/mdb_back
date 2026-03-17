import { Request, Response } from 'express'
import { validationResult, matchedData } from 'express-validator'
import { Sanitizer } from '../../helpers/sanitizer'
import apiHelpers from '../../helpers/apiHelpers'
import Messengers from '../../helpers/messengers'
import UserDocumentModel from '../../../models/UserDocumentModel'
import FileHelpers from '../../helpers/fileHelpers'
import { UploadedFile } from 'express-fileupload'
import { v4 as uuidv4 } from 'uuid'
import { Op } from 'sequelize'
import UsersHelpers from '../../helpers/UsersHelpers'
import DocumentsHelpers from '../../helpers/DocumentsHelpers'

export default class UserDocumentsCommonAppController {

    static async index(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const user_id = req.headers.auth_user as unknown as number
            const isAdmin = await UsersHelpers.isAdmin(user_id)

             // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const whereCondition: any = {
                deleted_at: null
            }

            if (!isAdmin) {
                whereCondition.uploaded_by = user_id
                whereCondition.intended_for = user_id
            }

            const documents = await UserDocumentModel.findAll({
                where: whereCondition,
                order: [['created_at', 'DESC']]
            })

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let documentsData: any[] = []

            if (documents.length) {
                documentsData = documents.map((document) => {
                    const documentDetail = document.get()
                    return {
                        ...documentDetail,
                        preview: FileHelpers.getPreview(documentDetail.file as string)
                    }
                })
            }

            responseJson.statut = true
            responseJson.message = 'Liste des documents récupérée avec succès'
            responseJson.data = documentsData
            res.status(200).json(responseJson)
        } catch (error) {
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }

    static async findDocument(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const { search } = req.query

            if (!search) {
                throw new Error('__messageFormatted__search__' + 'Entre un mot de recherche pour trouver un document')
            }

            const user_id = req.headers.auth_user
            const isAdmin = await UsersHelpers.isAdmin(user_id as unknown as number)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const whereConditions: any = {
                deleted_at: null
            }

            // Add search condition if search term provided
            whereConditions[Op.or] = [
                { file: { [Op.like]: `%${search}%` } },
                { name: { [Op.like]: `%${search}%` } }
            ]

            // Add user restriction for non-admin users
            if (!isAdmin) {
                whereConditions[Op.and] = [
                    {
                        [Op.or]: [
                            { uploaded_by: user_id },
                            { intended_for: user_id }
                        ]
                    }
                ]
            }

            const documents = await UserDocumentModel.findAll({
                where: whereConditions,
                order: [['created_at', 'DESC']]
            })

            responseJson.statut = true
            responseJson.message = 'Documents récupérés avec succès'
            responseJson.data = documents

            res.status(200).json(responseJson)
        } catch (error) {
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }

    static async viewDocument(req: Request, res: Response): Promise<void> {
        try {
            const ref = req.params.ref
            const user_id = req.headers.auth_user

            if (!ref) {
                throw new Error('__messageFormatted__ref__' + 'Fichier introuvable ou a été supprimé ou déplacé')
            }

            const document = await UserDocumentModel.findOne({
                where: {
                    ref,
                    [Op.or]: [
                        { uploaded_by: user_id },
                        { intended_for: user_id }
                    ]},
                raw: true
            })

            if (!document) {
                res.status(404).send('Document non trouvé ou accès non autorisé')
                return
            }

            // Stream le fichier depuis Amazon S3 ou votre stockage
            const fileStream = await FileHelpers.getFileStream(document.file as string)
            if (!fileStream) {
                throw new Error('Impossible de récupérer le fichier')
            }
            fileStream.pipe(res)
        } catch (error) {
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }

    static async addDocument(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const uploaded_by = req.headers.auth_user as unknown as number

            if (!uploaded_by) {
                throw new Error('__messageFormatted__uploaded_by__' + 'Utilisateur non trouvé')
            }

            const isAdmin = await UsersHelpers.isAdmin(uploaded_by);
            let intended_for = uploaded_by;
            let source = null;
            let source_ref = null;

            if (isAdmin) {
                if (!req?.body?.intended_for) {
                    throw new Error('__messageFormatted__intended_for__' + 'Utilisateur non trouvé');
                }
                intended_for = req.body.intended_for as unknown as number;

                const checkSourceAndRef = await DocumentsHelpers.checkSourceAndRef(req.body.source, req.body.source_ref);
                if (!checkSourceAndRef.statut) {
                    throw new Error('__messageFormatted__source__' + checkSourceAndRef.message);
                }

                source_ref = req.body.source_ref;
                source = req.body.source;
            }

            if (!intended_for) {
                throw new Error('__messageFormatted__intended_for__' + 'Utilisateur non trouvé');
            }

            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                responseJson.statut = false
                responseJson.message = Messengers.error.general.default
                responseJson.errors = Sanitizer.arrayToKeyObject("path", errors.array() as [] )
                res.status(400).json(responseJson)
                return
            }

            const data = matchedData(req)
            const nowDate = Sanitizer.getTimeByTimezone()

            if (!req.files?.file || Array.isArray(req.files.file)) {
                throw new Error('__messageFormatted__file__' + 'Un seul fichier est autorisé')
            }

            const fileCheck = await FileHelpers.verify(req, 'file', FileHelpers.DEFAULT_FILE_OPTIONS_WITH_PDF_AND_DOC)
            if (!fileCheck.statut) {
                throw new Error('__messageFormatted__file__' + fileCheck.errors.file)
            }

            const savedFile = await FileHelpers.save(req.files.file as UploadedFile)
            if (!savedFile) {
                throw new Error('__messageFormatted__file__' + Messengers.error.image.telechargement)
            }

            const ref = `${uploaded_by}-${uuidv4()}`
            const result = await UserDocumentModel.create({
                name: data.name,
                file: savedFile,
                ref,
                uploaded_by,
                intended_for,
                created_at: nowDate,
                updated_at: nowDate,
                source,
                source_ref
            })

            responseJson.statut = true
            responseJson.message = 'Document ajouté avec succès'
            responseJson.data = result
            res.status(200).json(responseJson)
        } catch (error) {
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }

    static async updateDocument(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const user_id = req.headers.auth_user
            const ref = req.params.ref

            if (!ref) {
                throw new Error('__messageFormatted__ref__' + 'Fichier introuvable ou a été supprimé ou déplacé')
            }

            const document = await UserDocumentModel.findOne({
                where: {
                    ref,
                    uploaded_by: user_id,
                    deleted_at: null
                }
            })

            if (!document) {
                throw new Error('Document non trouvé ou accès non autorisé')
            }

            const data = matchedData(req)
            const nowDate = Sanitizer.getTimeByTimezone()

            let newFile = document.file
            if (req.files?.file && !Array.isArray(req.files.file)) {
                const fileCheck = await FileHelpers.verify(req, 'file', FileHelpers.DEFAULT_FILE_OPTIONS_WITH_PDF_AND_DOC)
                if (!fileCheck.statut) {
                    throw new Error('__messageFormatted__file__' + fileCheck.errors.file)
                }

                newFile = await FileHelpers.save(req.files.file as UploadedFile)
                if (!newFile) {
                    throw new Error('__messageFormatted__file__' + Messengers.error.image.telechargement)
                }
            }

            const updateResult = await document.update({
                name: data.name || document.name,
                file: newFile,
                intended_for: data.intended_for || document.intended_for,
                updated_at: nowDate
            })

            if (!updateResult) {
                throw new Error('__messageFormatted__' + Messengers.error.general.default);
            }

            responseJson.statut = true
            responseJson.message = 'Document mis à jour avec succès'
            responseJson.data = document
            res.status(200).json(responseJson)
        } catch (error) {
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }

    static async deleteDocument(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const user_id = req.headers.auth_user
            const isAdmin = await UsersHelpers.isAdmin(user_id as unknown as number);
            const ref = req.params.ref

            if (!ref) {
                throw new Error('__messageFormatted__ref__' + 'Fichier introuvable ou a été supprimé ou déplacé')
            }

            const whereCondition: { ref: string, deleted_at: null, uploaded_by?: number  } = {
                ref,
                deleted_at: null
            }

            if (!isAdmin) {
                whereCondition.uploaded_by = user_id as unknown as number;
            }

            const document = await UserDocumentModel.findOne({
                where: whereCondition
            })

            if (!document) {
                throw new Error('__messageFormatted__ref__' + 'Document non trouvé ou accès non autorisé')
            }

            const updateResult = await document.update({
                deleted_at: Sanitizer.getTimeByTimezone()
            })

            if (!updateResult) {
                throw new Error('__messageFormatted__' + Messengers.error.general.default);
            }

            responseJson.statut = true
            responseJson.message = 'Document supprimé avec succès'
            res.status(200).json(responseJson)
        } catch (error) {
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }
}