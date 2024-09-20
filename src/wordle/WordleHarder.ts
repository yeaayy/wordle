import { WordleEngine, type UseI18n, type WordlistData, ValidationResult, WordleHard } from ".";

export class WordleHarder extends WordleHard {
  private list: string[]

  constructor(
    wordSize: number,
    lang: UseI18n,
    wordlist: WordlistData,
  ) {
    super(wordSize, lang, wordlist);
    this.list = wordlist.subsetWords.slice();
  }

  getAnswer(): string {
    return this.list[Math.floor(Math.random() * this.list.length)];
  }

  private check(word: string, guess: string): ValidationResult[] {
    const ans = this.getStat(word);
    const result = [];
    for (var i = 0; i < this.wordSize; i++) {
      const letter = guess[i];
      if (letter == word[i]) {
        result[i] = ValidationResult.CORRECT;
        ans.count[letter]--;
      }
    }
    for (var i = 0; i < this.wordSize; i++) {
      if (result[i] == ValidationResult.CORRECT) continue;
      const letter = guess[i];
      if (letter in ans.count && ans.count[letter] > 0) {
        result[i] = ValidationResult.CONTAIN;
        ans.count[letter]--;
      } else {
        result[i] = ValidationResult.FALSE;
      }
    }
    return result;
  }

  validate(guess: string): ValidationResult[] {
    WordleEngine.prototype.validate.call(this, guess);
    let stats = this.list.map(word => {
      return this.check(word, guess);
    });
    const result: ValidationResult[] = [];
    for (let i = 0; i < this.wordSize; i++) {
      const count = {
        [ValidationResult.CONTAIN]: 0,
        [ValidationResult.CORRECT]: 0,
        [ValidationResult.FALSE]: 0,
      }
      for (const stat of stats) {
        count[stat[i]]++;
      }
      let maxKey: ValidationResult = null!;
      let maxValue = 0;
      for (const key in count) {
        const value = count[key as ValidationResult];
        if (value > maxValue) {
          maxKey = key as ValidationResult;
          maxValue = value;
        }
      }
      result[i] = maxKey;
      this.list = this.list.filter((v, j) => stats[j][i] == maxKey);
      stats = stats.filter(v => v[i] == maxKey);
    }

    // Mark the letter as either used or known.
    for (let i = 0; i < result.length; i++) {
      const v = result[i];
      switch(v) {
        case ValidationResult.CONTAIN:
          this.used[guess[i]] = true;
          break;

        case ValidationResult.CORRECT:
          this.known[i] = guess[i];
          break;
      }
    }
    return result;
  }
}
