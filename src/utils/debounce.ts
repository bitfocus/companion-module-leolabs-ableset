/* eslint-disable @typescript-eslint/no-this-alias */

/**
 * Gathers all string values that the debounced function is called with
 * and calls the callback with a list of all values after the timeout.
 */
export function debounceGather<T extends string>(func: (values: T[]) => unknown, wait: number) {
	let timeout: NodeJS.Timeout | null = null
	const gatheredValues = new Set<T>()

	return function (this: unknown, ...values: T[]): void {
		const context = this
		values.forEach((v) => gatheredValues.add(v))

		const later = function () {
			timeout = null
			func.apply(context, [Array.from(gatheredValues.values())])
			gatheredValues.clear()
		}

		if (timeout) {
			clearTimeout(timeout)
		}

		timeout = setTimeout(later, wait)
	}
}
