/**
 * Gathers all string values that the debounced function is called with
 * and calls the callback with a list of all values after the timeout.
 */
export function debounceGather<T extends string>(func: (values: T[]) => unknown, wait: number) {
	let timeout: NodeJS.Timeout | null = null
	let gatheredValues = new Set<T>()

	return function (this: any, ...values: T[]) {
		let context = this
		values.forEach((v) => gatheredValues.add(v))

		var later = function () {
			timeout = null
			func.apply(context, [Array.from(gatheredValues.values())])
		}

		timeout && clearTimeout(timeout)
		timeout = setTimeout(later, wait)
	}
}

/**
 * Calls the callback after the function hasn't
 * been called for a given number of milliseconds.
 */
export function debounce(func: () => unknown, wait: number) {
	let timeout: NodeJS.Timeout | null = null

	return function (this: any, ...values: string[]) {
		let context = this

		var later = function () {
			timeout = null
			func.apply(context, [])
		}

		timeout && clearTimeout(timeout)
		timeout = setTimeout(later, wait)
	}
}
