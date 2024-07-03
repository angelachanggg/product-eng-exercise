export function pluralize(word: string) {
    return word.slice(-1) === "s" ? word+"es" : word+"s";
}
