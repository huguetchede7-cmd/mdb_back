import bcrypt from 'bcrypt';

/**
 * Compares a plain text password with a hashed password to check if they match.
 *
 * @param {string} plainPassword - The plain text password.
 * @param {string} hashedPassword - The hashed password.
 * @returns {Promise<boolean>} - Resolves to `true` if the passwords match, otherwise `false`.
 */
export const BcryptCheck = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
};

/**
 * Hashes a password using bcrypt with the given salt rounds.
 *
 * @param {string} password - The password to hash.
 * @param {number} [saltRounds=10] - The number of salt rounds to use. Defaults to 10.
 * @returns {Promise<string>} - Resolves to the hashed password.
 */
export const BcryptMake = async (password: string, saltRounds: number = 10): Promise<string> => {
    let hashedPassword = '';
    try {
        hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (err) {
        console.error('Error hashing password:', err);
    }
    return hashedPassword;
};
