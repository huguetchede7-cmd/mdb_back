export class AboutHelpers {

    static getShopsCount = () => 11;

    static getExperienceYears = () => {
        const currentYear = new Date().getFullYear();
        const creationYear = 2000;
        return currentYear - creationYear;
    }

    static getSlogan = () => {
        return "Votre vision, notre mission.";
    }
}