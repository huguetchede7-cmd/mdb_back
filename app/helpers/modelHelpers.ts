import moment from 'moment';
import { Sequelize } from 'sequelize';

const modelHelpers = {
    defaultScope: {
        order: [Sequelize.literal('id DESC')],
        where: { deleted_at: null }
    },

    simpleScope: {
        where: { deleted_at: null }
    },

    dateFormat: (rawValue: Date | string | null, targetFormat = 'DD MMM YYYY HH:mm') => {
        return rawValue ? moment(rawValue).format(targetFormat) : null;
    },

    imgFormat: (img: string) => {
        let imgCopy = img
        if (img) {
            imgCopy = `${process.env.AWS_S3_BUCKET_PREFIX}/${img}`
        }
        return imgCopy;
    }
}

export default modelHelpers;
