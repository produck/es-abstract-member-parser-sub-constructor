/**
 * Create a parser that checks if a value is a sub-constructor (derived class)
 * of a given base constructor.
 * @param base - The base constructor to check against
 * @returns A parser function that validates and returns the sub-constructor value
 * @throws {TypeError} If base is not a constructor
 */
export function SubConstructor(
	base: new (...args: unknown[]) => unknown,
): (value: unknown) => new (...args: unknown[]) => unknown;
