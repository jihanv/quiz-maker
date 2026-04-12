declare module "wink-lemmatizer" {
  type LemmatizeFn = (word: string) => string;

  interface WinkLemmatizer {
    noun: LemmatizeFn;
    verb: LemmatizeFn;
    adjective: LemmatizeFn;
    lemmatizeNoun: LemmatizeFn;
    lemmatizeVerb: LemmatizeFn;
    lemmatizeAdjective: LemmatizeFn;
  }

  const lemmatizer: WinkLemmatizer;

  export default lemmatizer;
}
