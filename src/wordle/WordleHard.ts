import { ValidationResult } from "./WordleEngine";
import { WordleMedium } from "./WordleMedium";

export class WordleHard extends WordleMedium {

  protected used: {[key: string]: boolean} = {};
  protected known: string[] = [];

  precheck(word: string): string | undefined {
      const result = super.precheck(word);
      if (result) return result;
      for (let i = 0; i < word.length; i++) {
        if (!this.known[i]) continue;
        if (this.known[i] !== word[i]) {
          return this.lang.t('letter_must_be', {
            n: i + 1,
            letter: this.known[i],
          }, i + 1);
        }
      }
      for (const letter in this.used) {
        if (word.indexOf(letter) === -1) {
          return this.lang.t('letter_must_used', { letter });
        }
      }
      return undefined;
  }

  validate(word: string): ValidationResult[] {
      const result = super.validate(word);
      for (let i = 0; i < result.length; i++) {
        const v = result[i];
        switch(v) {
          case ValidationResult.CONTAIN:
            this.used[word[i]] = true;
            break;
          case ValidationResult.CORRECT:
            this.known[i] = word[i];
            break;
        }
      }
      return result;
  }

}
