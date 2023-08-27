export function generateSwitchSyntaxError(prop: never): Error {
  return new Error(`The property ${prop} isn't supported`);
}
