/**
 * Returns an array of numbers from 0 to the given number.
 * @example makeRange(2) // returns [0, 1]
 */
export const makeRange = (number: number): number[] => {
	return Array(number)
		.fill(0)
		.map((_, i) => i)
}
