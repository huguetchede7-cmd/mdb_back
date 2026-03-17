import jwt from "jsonwebtoken"
import momentTimeZone from "moment-timezone"
import { Sanitizer } from "./sanitizer"
import { TOKEN_TYPES, TokenModel } from "../../models/TokenModel"
import { LogHelpers } from "./LogHelpers"
import { tokenPayloadType } from "../../types/token/tokenPayload"
const TOKEN_EXPIRATION_MINUTES = 30

export class TokenHelper {
  // Function to generate the verification link
  static async generate(payload: tokenPayloadType): Promise<string> {
    try {
      const nowDate = Sanitizer.getTimeByTimezone()
      const expirationMinutes = payload.expirationMinutes ?? TOKEN_EXPIRATION_MINUTES
      const { dbTransaction, ...jwtPayload } = payload
      const token = jwt.sign({...jwtPayload, expirationTime: Sanitizer.getTimeByTimezone(undefined, undefined, expirationMinutes as number)}, process.env.SECRET_JWT_KEY as string, {
        algorithm: "HS256",
        expiresIn: `${expirationMinutes}m`
      })

      if (dbTransaction) {
        await TokenModel.create({token: token,type: payload.action, user_id: payload.user, created_at: nowDate, updated_at: nowDate}, {transaction: dbTransaction})
      } else {
        await TokenModel.create({token: token,type: payload.action, user_id: payload.user, created_at: nowDate, updated_at: nowDate})
      }

      return token
    } catch (error) {
      LogHelpers.showException(error as Error)
      return ""
    }
  }
  // Function to decode and validate the token
  static async validate(token: string, rules = { action: TOKEN_TYPES.EMAIL_VERIFICATION }): Promise<{
    user: string
    action: string | number
    expirationTime: string | Date} | null> {
      try {
        // check existance in database
        const isTokenExiste = await TokenModel.findOne({where: { token: token ,is_active: true}})
        if (!isTokenExiste) {
          throw new Error("Invalid in token.")
        }

        // Decode the token
        const decodedToken = jwt.verify(token, process.env.SECRET_JWT_KEY as string, {
          algorithms: ["HS256"]
        }) as { user: string; action: string; expirationTime: string }

        // Check if the token action matches
        if (decodedToken.action != String(rules?.action)) {
          throw new Error("Invalid action in token.")
        }

        // Get the current time in Benin timezone
        const nowTime = Sanitizer.getTimeByTimezone()

        // Compare expiration time with the current time
        if (momentTimeZone(nowTime).isAfter(decodedToken.expirationTime)) {
          await TokenModel.update({ is_active: false }, { where: { token: token } })
          throw new Error("Token has expired.")
        }
        return decodedToken
      } catch (error) {
        LogHelpers.showException(error as Error)
        return null
      }
  }
}
