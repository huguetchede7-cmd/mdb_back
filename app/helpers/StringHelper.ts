export class StringHelper {
    /**
     * Met la première lettre en majuscule
     * ex: "bonjour" → "Bonjour"
     */
    static ucFirst(value: string): string {
        if (!value) return '';
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}
