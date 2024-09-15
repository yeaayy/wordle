import { WordleSimple } from "./WordleSimple";

export class WordleMedium extends WordleSimple {

  precheck(word: string): string | undefined {
      const result = super.precheck(word);
      if (result) return result;
      if (this.wordlist.allWords.indexOf(word) === -1) {
        return this.lang.t('word_not_found');
      }
      return undefined;
  }

}
