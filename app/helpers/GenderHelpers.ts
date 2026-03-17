export class GendersHelpers {
    
    static TYPES = {
        MAN: 1,
        WOMAN:2,
        CHILD:3,
        MAN_WOMAN:4,
        MAN_CHILD:5,
        WOMAN_CHILD:6,
        MAN_WOMAN_CHILD:7,
        ALL:8
    }

    static format(genderNumber: number) {
        const genders = []

        switch (genderNumber) {
            case 1:
                genders.push('Homme')
                break
            case 2:
                genders.push('Femme')
                break
            case 3:
                genders.push('Enfant')
                break
            case 4:
                genders.push('Homme')
                genders.push('Femme')
                break
            case 5:
                genders.push('Homme')
                genders.push('Enfant')
                break
            case 6:
                genders.push('Femme')
                genders.push('Enfant')
                break
            case 7:
                genders.push('Homme')
                genders.push('Femme')
                genders.push('Enfant')
                break
            case 8:
                genders.push('Tous les genres')
                break
            default:
                genders.push('Tous les genres')
        }
        
        return genders
    }

    /**
     * Retourne les identifiants des types de genres concernés par un type sélectionné.
     * Ex: Si un offre cible "Homme" (1), tous les genres groupant les hommes (Homme/Femme, Homme/Enfant, etc.) sont concernés.
     * @param genderNumber 
     * @returns string[] - Liste des IDs où ce genre est concerné
     */
    static formatNumber(genderNumber: number) {
        // Définition des correspondances inverses: pour chaque genre de base, liste des types où il est inclus
        const genderImpacts: { [key: number]: string[] } = {
            1: ["1", "4", "5", "7", "8"],     // Homme est présent dans: Homme, Homme+Femme, Homme+Enfant, Homme+Femme+Enfant, Tous
            2: ["2", "4", "6", "7", "8"],     // Femme est présent dans: Femme, Homme+Femme, Femme+Enfant, Homme+Femme+Enfant, Tous
            3: ["3", "5", "6", "7", "8"],     // Enfant présent dans: Enfant, Homme+Enfant, Femme+Enfant, Homme+Femme+Enfant, Tous
            4: ["4", "7", "8"],               // Homme+Femme est contenu dans: Homme+Femme, Homme+Femme+Enfant, Tous
            5: ["5", "7", "8"],               // Homme+Enfant est contenu dans: Homme+Enfant, Homme+Femme+Enfant, Tous
            6: ["6", "7", "8"],               // Femme+Enfant est contenu dans: Femme+Enfant, Homme+Femme+Enfant, Tous
            7: ["7", "8"],                    // Homme+Femme+Enfant contenu dans: lui-même et Tous
            8: ["8"],                         // Tous
        };

        return genderImpacts[genderNumber] || ["1", "2", "3", "4", "5", "6", "7", "8"];
    }
}