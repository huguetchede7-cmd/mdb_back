import jwt from 'jsonwebtoken';

export class JWTHelper {
    private static secretKey: string = process.env.SECRET_JWT_KEY || '';

    static generateToken(data: unknown): string {
        if (!this.secretKey) {
            throw new Error('Secret JWT key is not defined');
        }
        return jwt.sign({ data }, this.secretKey);
    }

    static decodeToken(token: string): { statut: boolean; data?: unknown; error?: string } {
        const response: { statut: boolean; data?: unknown; error?: string } = { statut: false };

        try {
            if (!this.secretKey) {
                throw new Error('Secret JWT key is not defined');
            }
            const decoded = jwt.verify(token, this.secretKey) as jwt.JwtPayload;
            response.statut = true;
            response.data = decoded.data;
        } catch (error) {
            if (error instanceof Error) {
                response.error = error.message;
            } else {
                response.error = 'An unknown error occurred';
            }
        }

        return response;
    }
}
