import axios from 'axios';

export class AddressHelpers {
  /**
   * Extrait la latitude et la longitude d'une URL Google Maps.
   * @param url Lien Google Maps.
   * @returns {Promise<{ lat: number; lng: number } | null>}
   */
  static async getLonLat(url: string): Promise<{ lat: number; lng: number } | null> {
    try {
      if (!url) return null;

      // Resolve shortened URLs (maps.app.goo.gl, goo.gl/maps)
      if (url.includes("goo.gl/maps") || url.includes("maps.app.goo.gl")) {
        const resolvedUrl = await AddressHelpers.resolveShortUrl(url);
        if (resolvedUrl) url = resolvedUrl;
      }

      // Regex patterns for different Google Maps URL formats
      const regexPatterns = [
        /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,   // !3dlat!4dlng format
        /@(-?\d+\.\d+),(-?\d+\.\d+)/,       // @lat,lng format
        /\?q=(-?\d+\.\d+),(-?\d+\.\d+)/,    // ?q=lat,lng format
        /\/dir\/(-?\d+\.\d+),(-?\d+\.\d+)/, // /dir/lat,lng format
        /\/search\/(-?\d+\.\d+)/,           // /search/lat,lng format
      ];

      for (const regex of regexPatterns) {
        const match = url.match(regex);
        if (match) {
          const lat = parseFloat(match[1]);
          const lng = parseFloat(match[2]);
          return { lat, lng };
        } else {
          const res = await AddressHelpers.getCoordinatesFromGoogleMapsUrl(url)
          if (res) {
            return res
          }
        }
      }

      return null;
    } catch (error) {
      console.error("Error extracting coordinates:", error);
      return null;
    }
  }

  
/**
 * Extracts latitude and longitude from a Google Maps shortened URL
 * @param {string} shortUrl - The shortened Google Maps URL (e.g., https://maps.app.goo.gl/xyz)
 * @returns {Promise<{latitude: number, longitude: number} | null>} - Object containing coordinates or null if not found
 */
static async  getCoordinatesFromGoogleMapsUrl(finalUrl: string): Promise<{ lat: number; lng: number } | null>  {
  try {
    const atCoordPattern = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const atCoordMatch = finalUrl.match(atCoordPattern);
    
    if (atCoordMatch) {
      return {
        lat: parseFloat(atCoordMatch[1]),
        lng: parseFloat(atCoordMatch[2])
      }
    }
    
    const dCoordPattern = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/;
    const dCoordMatch = finalUrl.match(dCoordPattern);
    
    if (dCoordMatch) {
      return {
        lat: parseFloat(dCoordMatch[1]),
        lng: parseFloat(dCoordMatch[2])
      }
    }
    
    const llCoordPattern = /ll=(-?\d+\.\d+),(-?\d+\.\d+)/;
    const llCoordMatch = finalUrl.match(llCoordPattern);
    
    if (llCoordMatch) {
      return {
        lat: parseFloat(llCoordMatch[1]),
        lng: parseFloat(llCoordMatch[2])
      }
    }

    return null
  } catch (error) {
    console.error("Error retrieving coordinates:", (error as Error).message);
    return null;
  }
}

  /**
   * Suit la redirection d'un lien Google Maps raccourci.
   * @param shortUrl URL courte à résoudre.
   * @returns {Promise<string | null>} URL complète après redirection.
   */
  static async resolveShortUrl(url: string): Promise<string | null> {
    try {
      const response = await axios.get(url, {
        maxRedirects: 5,
        validateStatus: (status) => status >= 200 && status < 400, // Ignore 3xx redirections
      });

      return response.request.res.responseUrl || null;
    } catch (error) {
      console.error("Error resolving short URL:", error);
      return null;
    }
  }
}