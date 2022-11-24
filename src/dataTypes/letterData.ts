export default class LetterData {
    public centerLetter: string;
    public outerLetters: string[];
    public words: string[];

    constructor(centerLetter: string, outerLetters: string[], words: string[]) {
        this.centerLetter = centerLetter;
        this.outerLetters = outerLetters;
        this.words = words;
    }
}
