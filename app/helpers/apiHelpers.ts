import Messengers from './messengers';
import { ApiDefaultResponseType } from '../../types/ApiDefaultResponseType';

class ApiHelpers {
    static FETCH_LIMIT: number = 24;

    static DEFAULT_RESPONSE_JSON: ApiDefaultResponseType = {
        statut: false,
        message: "",
        error_code: "",
        errors: null,
        data: null,
        debug: null
    };

    static DEFAULT_PAGINATION_RESPONSE_JSON: {
        totalCount: number;
        currentPage: number;
        list: unknown[];
    } = {
        totalCount: 0,
        currentPage: 1,
        list: [],
    };
    
    /**
     * Check if a value is numeric
     * @param value - The value to check
     * @returns boolean
     */
    static isNumeric(value: unknown): boolean {
        return !isNaN(parseFloat(value as string)) && isFinite(value as number);
    }


    /**
     * Calculate the offset for pagination
     * @param currentPage - The current page
     * @param listPerPage - Number of items per page
     * @returns number
     */
    static getOffset(currentPage = 1, listPerPage: number): number {
        return (currentPage - 1) * listPerPage;
    }


    /**
     * Return null if rows are null, undefined, empty array, or empty object
     * @param rows - The rows to check
     * @returns null or rows
     */
    static nullOrRows<rows>(rows: rows): rows | null {
        if (rows === null || rows === undefined) return null;

        if (Array.isArray(rows) && rows.length === 0) return null;

        if (typeof rows === "object" && Object.keys(rows as object).length === 0)
            return null;

        return rows;
    }


    /**
     * Generate a response object
     * @param data - Response data
     * @param message - Response message
     * @param meta - Meta information
     * @param statut - Status of the response
     * @returns Response object
     */
    static generateResponse(
        data: unknown = null,
        message: string = "",
        meta: unknown = null,
        statut: boolean = true
    ): Record<string, unknown> {
        const response: Record<string, unknown> = { statut, data };

        if (message) response.message = message;
        if (meta) response.meta = meta;

        return response;
    }


    /**
     * Bind an error to a response format
     * @param err - The error object
     * @returns Response JSON object
     */
    static bindError(err: Error): Record<string, unknown> {
        const responseJson = { ...ApiHelpers.DEFAULT_RESPONSE_JSON };
        let messageFormatted: string | null = null;

        if (err?.message.includes("__messageFormatted__")) {
            messageFormatted = err.message.replace("__messageFormatted__", "");
            if (messageFormatted?.indexOf("__") != -1) {
                const subExploseMessage = messageFormatted?.split("__");
                messageFormatted = ""
                responseJson.errors = {[subExploseMessage[0]] : subExploseMessage[1]}
            }
        }

        responseJson.message = messageFormatted ?? Messengers.error.general.default;
        if (process.env.NODE_ENV === "DEV" || process.env.SHOW_DEBUG === "true") {
            console.log({ message: err.message, error: err.stack })
            responseJson.debug = { message: err.message, error: err.stack }
        }

        return responseJson;
    }


    /**
     * Get the pagination format
     * @param params - Pagination parameters
     * @returns Pagination format object
     */
    static getPaginationFormat({
        total,
        currentPage,
        perPage = ApiHelpers.FETCH_LIMIT,
    }: {
        total: number;
        currentPage: number;
        perPage?: number;
    }): {
        total: number;
        perPage: number;
        currentPage: number;
        lastPage: number;

    } {
        const lastPage = Math.ceil(total / perPage);
        return {
            total,
            perPage,
            currentPage,
            lastPage: lastPage > 0 ? lastPage : 1,
        };
    }
}

export default ApiHelpers;
