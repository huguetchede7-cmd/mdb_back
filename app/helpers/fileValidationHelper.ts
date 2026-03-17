import { Request, Response, NextFunction } from 'express';
import path from 'path';

// Type pour l'interface d'un fichier (en cas d'utilisation de express-fileupload)
/*interface FileUpload {
    name: string;
    size: number;
    data: Buffer;
}*/

// Fonction de validation des fichiers
export const validateFiles = (allowedExtensions: string[], maxSize: number, allowedFileName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Récupérer les fichiers de la requête
        const files = req.files?.files || req.body?.files;

        if (!files || !Array.isArray(files)) {
            return res.status(400).json({ message: 'Aucun fichier n\'a été envoyé.' });
        }

        // Itérer sur tous les fichiers pour vérifier les conditions
        for (const file of files) {
            const fileName = file.name;

            // Vérification du nom du fichier (si nécessaire)
            if (allowedFileName && fileName !== allowedFileName) {
                return res.status(400).json({ message: `Le fichier doit s'appeler ${allowedFileName}.` });
            }

            // Vérification de la taille du fichier
            if (file.size > maxSize) {
                return res.status(400).json({ message: `Le fichier ${fileName} est trop volumineux. La taille maximale est de ${maxSize / (1024 * 1024)}MB.` });
            }

            // Vérification de l'extension du fichier
            const fileExtension = path.extname(fileName).toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                return res.status(400).json({ message: `L'extension ${fileExtension} du fichier ${fileName} n'est pas autorisée. Les extensions autorisées sont : ${allowedExtensions.join(', ')}.` });
            }
        }

        // Si toutes les validations passent, on continue
        next();
    };
};
