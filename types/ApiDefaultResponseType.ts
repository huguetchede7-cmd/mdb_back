export type ApiDefaultResponseType = { 
    statut: boolean; 
    message: string; 
    errors: unknown; 
    data: unknown; 
    error_code: null | unknown; 
    debug: null | { message: string, error: string | undefined}
};