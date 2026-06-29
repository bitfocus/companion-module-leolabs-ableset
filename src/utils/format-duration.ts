/**
 * Formats a duration in seconds into a human-readable format.
 */
export function formatDuration(seconds: number, allowNegative = false): string {
	if (typeof seconds !== 'number' || Number.isNaN(seconds)) {
		return ''
	}

	if (!allowNegative && seconds < 0) {
		seconds = 0
	}

	const isNegative = seconds < 0
	const absoluteSeconds = Math.abs(seconds)

	const hours = Math.floor(absoluteSeconds / 3600)
	const minutes = Math.floor((absoluteSeconds % 3600) / 60)
	const secs = Math.floor(absoluteSeconds % 60)

	const parts: string[] = []

	if (hours > 0) {
		parts.push(hours.toString().padStart(2, '0'))
	}

	parts.push(minutes.toString().padStart(2, '0'))
	parts.push(secs.toString().padStart(2, '0'))

	const formatted = parts.join(':')

	return isNegative ? `-${formatted}` : formatted
}
