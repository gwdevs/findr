//TODO: is this necessary? Will it handle languages defined in a non-ASCII language?
export function isUpperCase(input: string) {
  return input.toUpperCase() === input && input.toLowerCase() !== input;
}
