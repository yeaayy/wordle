import { WordleEngine, ValidationResult, type WordlistData, type UseI18n } from "./WordleEngine";

export class WordleSimple extends WordleEngine {
  private answer;

  constructor(
    wordSize: number,
    lang: UseI18n,
    wordlist: WordlistData,
    answer?: string,
  ) {
    super(wordSize, lang, wordlist);
    if (answer === undefined) {
      this.answer = wordlist.subsetWords[Math.floor(Math.random() * wordlist.subsetWords.length)];
    } else {
      this.answer = answer;
    }
  }

  getAnswer(): string {
      return this.answer;
  }

  protected getStat(word: string) {
    const count: { [key: string]: number } = {};
    const index: { [key: string]: number[] } = {};
    for (var i = 0; i < word.length; i++) {
      const x = word[i];
      count[x] = (count[x] ?? 0) + 1;
      (index[x] ?? (index[x] = [])).push(i);
    }
    Object.preventExtensions(count);
    Object.preventExtensions(index);
    const result = { count, index }
    Object.preventExtensions(result);
    return result;
  }

  validate(word: string): ValidationResult[] {
    super.validate(word);

    const ans = this.getStat(this.answer);
    const result = [];
    for (var i = 0; i < this.wordSize; i++) {
      const letter = word[i];
      if (letter == this.answer[i]) {
        result[i] = ValidationResult.CORRECT;
        ans.count[letter]--;
      }
    }
    for (var i = 0; i < this.wordSize; i++) {
      if (result[i] == ValidationResult.CORRECT) continue;
      const letter = word[i];
      if (letter in ans.count && ans.count[letter] > 0) {
        result[i] = ValidationResult.CONTAIN;
        ans.count[letter]--;
      } else {
        result[i] = ValidationResult.FALSE;
      }
    }
    return result;
  }
}
