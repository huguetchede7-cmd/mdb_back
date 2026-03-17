import axios, { AxiosError } from 'axios';
import { LogHelpers } from '../helpers/LogHelpers';

interface OmnisendContact {
    email: string;
    firstName?: string;
    lastName?: string;
    tags?: string[];
    status?: 'subscribed' | 'unsubscribed' | 'nonSubscribed';
    statusDate?: string;
}

interface OmnisendResponse {
    contactID: string;
    email: string;
    firstName?: string;
    lastName?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface OmnisendListResponse {
    listID: string;
    contactID: string;
    status: string;
    createdAt: string;
}

export class OmnisendService {
    private apiKey: string;
    private baseUrl: string = 'https://api.omnisend.com/v3';

    constructor() {
        this.apiKey = process.env.OMNISEND_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('OMNISEND_API_KEY environment variable is required');
        }
    }

    /**
     * Créer ou mettre à jour un contact dans Omnisend
     * @param contact - Les données du contact
     * @returns Promise avec la réponse d'Omnisend
     */
    async createOrUpdateContact(contact: OmnisendContact): Promise<OmnisendResponse | null> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/contacts`,
                {
                    email: contact.email,
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    tags: contact.tags || ['newsletter'],
                    status: contact.status || 'subscribed',
                    statusDate: contact.statusDate || new Date().toISOString()
                },
                {
                    headers: {
                        'X-API-KEY': this.apiKey,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    // Erreur de l'API Omnisend
                    console.log(`Omnisend API Error: ${error.response.data.message || error.response.statusText}`);
                } else if (error.request) {
                    // Erreur de réseau
                    console.log('Network error: Unable to reach Omnisend API');
                }
            }
            // Autre erreur
            console.log(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return null
        }
    }

    /**
     * Vérifier si un contact existe déjà
     * @param email - L'email du contact
     * @returns Promise avec true si le contact existe
     */
    async contactExists(email: string): Promise<boolean> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/contacts?email=${encodeURIComponent(email)}`,
                {
                    headers: {
                        'X-API-KEY': this.apiKey
                    }
                }
            );

            return response.data.contacts && response.data.contacts.length > 0;
        } catch (error) {
            if (error instanceof AxiosError) {
                // Si l'erreur est 404, le contact n'existe pas
                if (error.response?.status === 404) {
                    return false;
                }
                console.log(`Omnisend API Error: ${error.response?.data?.message || error.message}`);
            }
            console.log(`Error checking contact existence: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return false
        }
    }

    /**
     * Ajouter un contact à une liste spécifique
     * @param contactId - L'ID du contact
     * @param listId - L'ID de la liste
     * @returns Promise avec la réponse
     */
    async addContactToList(contactId: string, listId: string): Promise<OmnisendListResponse | null> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/lists/${listId}/contacts`,
                {
                    contactID: contactId
                },
                {
                    headers: {
                        'X-API-KEY': this.apiKey,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                LogHelpers.showException(new Error(`Omnisend API Error: ${error.response?.data?.message || error.message}`));
            } else {
                LogHelpers.showException(error instanceof Error ? error : new Error('Unknown error'));
            }
            return null;
        }
    }
}

export default OmnisendService;
