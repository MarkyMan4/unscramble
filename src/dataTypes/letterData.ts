export default class LetterData {
    public centerLetter: string;
    public outerLetters: string[];
    public words: string[];
    public maxScore: number;

    constructor(centerLetter: string, outerLetters: string[], words: string[], maxScore: number) {
        this.centerLetter = centerLetter;
        this.outerLetters = outerLetters;
        this.maxScore = maxScore;
        this.words = words;
    }
}
