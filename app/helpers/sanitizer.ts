import momentTimeZone from 'moment-timezone';
import UserModel from '../../models/UserModel';
import slugify from "slugify";
import BrandModel from "../../models/BrandModel";
import NewsModel from "../../models/NewsModel";
import ServiceModel from "../../models/ServiceModel";
import ShopModel from "../../models/ShopModel";
import ProductModel from "../../models/ProductModel";
import BannerTextModel from "../../models/BannerTextModel";
import AppointmentModel from "../../models/AppointmentModel";
import EventModel from "../../models/EventModel";
import OfferModel from '../../models/OfferModel';
import GlassCategoryModel from '../../models/GlassCategoryModel';
import GlassShapeModel from '../../models/GlassShapeAttributes';
//import { Model, Optional } from 'sequelize';

type modelType = typeof UserModel|typeof BrandModel|typeof NewsModel|typeof OfferModel | typeof ServiceModel| typeof ShopModel|typeof ProductModel|typeof BannerTextModel|typeof EventModel|typeof AppointmentModel|typeof GlassCategoryModel |typeof GlassShapeModel;


export const Sanitizer = {
   
    uniqueData: async (model:  modelType, column: string, data: string, initcount: number = 7, inc: boolean = false) => {
        try {
           // let generatedData = data.toLowerCase().trim();
            let generatedData =  slugify(data, { lower: true, strict: true })
            const whereClause: { [key: string]: string }  = {}
            let foundCount = 0
            whereClause[column] = generatedData
            // @ts-expect-error - model is a model type
            while (await model.findOne({
            attributes: [column],
            where: whereClause
        })) {
            generatedData = Sanitizer.generateNum(initcount + foundCount, generatedData);
            whereClause[column] = generatedData;
            if (inc) {
                foundCount++;
            }
        }
        return generatedData;
        } catch {
            return ""
        }
    },

    // Fonction pour générer un slug unique
    generateSlugUnique:async (
        model:typeof UserModel,
        column: string, 
        data: string, 
        initcount: number = 7, /*inc: boolean = false*/) => {
        const slug = slugify(data, { lower: true, strict: true });
        const whereClause: { [key: string]: string }  = {}
        let existingSlug = await model.findOne({
            where: whereClause
        });

        let counter = initcount;
        while (existingSlug) {
            const newSlug = `${slug}-${counter}`;
            existingSlug = await model.findOne({
                where: { [column]: newSlug }
            });
            counter++;
        }
        return existingSlug ? `${slug}-${counter}` : slug;
    },

    generateNum: (len = 7, generatedData = "") => {
        const codeRange = Math.pow(10, len)
        return `${generatedData}${Math.floor(Math.random() * codeRange)}`;
    },

    arrayToKeyObject: (key: string, array: []) => {
        const newObj = {}

        array.forEach(element => {
            newObj[element[key]] = element["msg"]
        })

        return newObj
    },

    getTimeByTimezone: (format = 'YYYY-MM-DD HH:mm:ss', timeZone = "Africa/Porto-Novo", minutesToAdd = 0) => {
        // Get the current time in Benin timezone
        const beninTime = momentTimeZone.tz(Date.now(), timeZone);
        const expirationTime = beninTime.add(minutesToAdd, 'minutes');
        return expirationTime.format(format);
    },

    generateRandomAlphanumeric: (length: number) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    },

    generateRandomNumeric: (length: number) => {
        const characters = '0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    },

    phoneNumberWithUnderscore: async (value: string) => {
        const regex = /^[0-9]+_[0-9]+$/;
        const result = await regex.test(value)
        return result;
    },

    phoneClean: (value: string) => { return (`${value} `)?.replaceAll(" ", '').replaceAll("+", '')},

    isStrongPassword: (password: string) => {
        try {
            const minLength = 6;
            const hasLowercase = /[a-z]/.test(password);
            const hasUppercase = /[A-Z]/.test(password);
            const hasDigit = /\d/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

            if (password.length < minLength) {
                throw new Error('Trop court. Au moins 8 caractères.')
            }

            if (!hasLowercase) {
                throw new Error('Au moins une lettre miniscule.')
            }

            if (!hasUppercase) {
                throw new Error('Au moins une lettre majuscule.')
            }

            if (!hasDigit) {
                throw new Error('Au moins un chiffre: 0,1,2,3,...')
            }

            if (!hasSpecialChar) {
                throw new Error('Au moins un caractère spécial: @,!,#,-...')
            }

            return { statut: true }
        } catch (error: unknown) {
            if (error instanceof Error) {
                return { statut: false, message: error.message }
            }
            return { statut: false, message: 'Une erreur inconnue est survenue.' }
        }
    },

    isValidYouTubeLink: (url: string) => {
        const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        return regex.test(url);
    },

     isValidTikTokLink:(url: string) => {
        const regex = /^(https?:\/\/)?(www\.)?(tiktok\.com|vm\.tiktok\.com)\/(@[\w.-]+\/video\/\d+|[\w.-]+)$/;
        return regex.test(url);
    },

    isValidEmailFormat(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
}