import type { useI18n } from "vue-i18n";

export enum ValidationResult {
  CORRECT = 'correct',
  FALSE = 'false',
  CONTAIN = 'contain',
};

export class PrecheckError extends Error {
  constructor(message?: string) {
    super(message)
  }
}

export type WordlistData = {
  id: string;
  allWords: string[];
  subsetWords: string[];
}

export type UseI18n = ReturnType<typeof useI18n>;

export abstract class WordleEngine {
  constructor(
    protected wordSize: number,
    protected lang: UseI18n,
    protected wordlist: WordlistData,
  ) { }

  abstract getAnswer(): string;

  precheck(word: string): string | undefined {
    if (word.length < this.wordSize) {
      return this.lang.t('word_too_short');
    } else if (word.length < this.wordSize) {
      return this.lang.t('word_too_long');
    }
    return undefined;
  }

  validate(word: string): ValidationResult[] {
    const precheck = this.precheck(word);
    if (precheck) throw new PrecheckError(precheck);
    return [];
  }
}
