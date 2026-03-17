import axios from 'axios';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

interface AppleKey {
    kid: string;
    kty: "RSA";
    n: string;
    e: string;
    alg: string;
    use: string;
}

/**
 * Verifies an Apple identity token by fetching Apple's public keys and decoding the token.
 *
 * @param {string} identityToken - The Apple identity token to verify.
 * @returns {Promise<JwtPayload | null>} - The verified token payload if valid, or null if verification fails.
 */
export const AppleAuthentificationHelpers = {
    verifyAppleIdentityToken: async (identityToken: string): Promise<JwtPayload | null> => {
        try {
            // Fetch Apple's public keys
            const appleKeysResponse = await axios.get<{ keys: AppleKey[] }>('https://appleid.apple.com/auth/keys');
            const appleKeys = appleKeysResponse.data.keys;

            // Decode the identity token to get the key ID (kid)
            const decoded = jwt.decode(identityToken, { complete: true }) as { header: { kid: string } } | null;
            if (!decoded || !decoded.header) {
                throw new Error("Invalid Apple identity token format");
            }

            // Find the corresponding key
            const appleKey = appleKeys.find(key => key.kid === decoded.header.kid);
            if (!appleKey) {
                throw new Error("Invalid Apple login token: Key not found");
            }

            // Convert the JWK to a PEM
            const publicKey = jwkToPem(appleKey);

            // Verify the token
            const verifiedPayload = jwt.verify(identityToken, publicKey, {
                algorithms: ['RS256'],
                issuer: 'https://appleid.apple.com',
                audience: process.env.APP_CLIENT_IOS_BUNDLE_ID,
            }) as JwtPayload;

            return verifiedPayload;
        } catch (error) {
            console.error("Error verifying Apple identity token:", error);
            return null;
        }
    },
};
