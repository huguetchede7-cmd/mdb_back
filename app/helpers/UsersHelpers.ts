import { ACCOUNT_TYPES } from "../../models/AccountTypeModel";
import UserModel from "../../models/UserModel";
import { LogHelpers } from "./LogHelpers";
import { randomBytes } from 'crypto'

interface PasswordOptions {
  length?: number
  uppercase?: boolean
  lowercase?: boolean
  numbers?: boolean
  symbols?: boolean
}

class UsersHelpers {



    static TYPES = {
        PUBLIC: 1,
        CLUB: 2,
        ELITE: 3,
    }

    static async isAdmin(userId: number): Promise<boolean> {
        try {
            const user = await UserModel.findOne({ where: { id: userId }})
            const userDetail = user?.get()
            if (!userDetail) {
                throw new Error('__messageFormatted__user__' + 'Utilisateur non trouvé')
            }
            return userDetail.account_type === ACCOUNT_TYPES.ADMIN;
        } catch (error) {
            LogHelpers.showException(error as Error);
            return false;
        }
    }

    static offerTaget (clientTypes: number) {
        switch (clientTypes) {
            case UsersHelpers.TYPES.PUBLIC:
                return 'Tout le monde'
            case UsersHelpers.TYPES.CLUB:
                return 'Membres Club'
            case UsersHelpers.TYPES.ELITE:
                return 'Membres Elite'
        }
    }

  static generateSecurePassword = (
    options: PasswordOptions = {}
  ): string => {
    const {
      length = 12,
      uppercase = true,
      lowercase = true,
      numbers = true,
      symbols = true
    } = options

    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lower = 'abcdefghijklmnopqrstuvwxyz'
    const nums = '0123456789'
    const syms = '!@#$%^&*()-_=+[]{};:,.<>?'

    let charset = ''
    if (uppercase) charset += upper
    if (lowercase) charset += lower
    if (numbers) charset += nums
    if (symbols) charset += syms

    if (!charset) {
      throw new Error('Au moins un type de caractère doit être activé')
    }

    const randomValues = randomBytes(length)
    let password = ''

    for (let i = 0; i < length; i++) {
      password += charset[randomValues[i] % charset.length]
    }

    return password
  }
}

export default UsersHelpers;    