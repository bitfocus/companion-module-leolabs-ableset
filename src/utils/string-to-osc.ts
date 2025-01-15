import type { Argument } from 'node-osc'

export interface OscCommand {
	host?: string
	port?: number
	address: string
	args?: Argument[]
}

enum State {
	InHost,
	InAddress,
	AfterAddress,
	InArgument,
	InString,
	AfterArgument,
	AfterCommand,
}

export const parseArgument = (arg: string): Argument => {
	if (arg.match(/^[+-]?\d+$/)) {
		return { type: 'integer', value: Number(arg) }
	} else if (arg.match(/^[+-]?\d+\.\d*$/)) {
		return { type: 'float', value: Number(arg) }
	} else if (arg === 'true') {
		return { type: 'boolean', value: true }
	} else if (arg === 'false') {
		return { type: 'boolean', value: false }
	} else if (isStringQuote(arg[0]!) && isStringQuote(arg[arg.length - 1]!)) {
		const stringQuote = arg[0]!
		return {
			type: 'string',
			value: arg.substring(1, arg.length - 1).replaceAll(`\\${stringQuote}`, stringQuote),
		}
	} else {
		return { type: 'string', value: arg }
	}
}

const isWhiteSpace = (char: string) => {
	return char === ' ' || char === ' ' || char === '\t' || char === '\n'
}

const isStringQuote = (char: string) => {
	return char === `"` || char === `'` || char === '`'
}

const parseHost = (input: string): { host?: string; port?: number } => {
	if (!input.trim() || !input.includes(':')) {
		return {}
	} else {
		const [host, port] = input.split(':')
		return { host, port: Number(port) }
	}
}

export const parseOscCommands = (input: string): OscCommand[] => {
	const commands: OscCommand[] = []
	let state = State.InHost

	let currentHost = ''
	let currentAddress = ''
	let currentArgs: string[] = []
	let hostStart = 0
	let addressStart = 0
	let argumentStart = 0
	let stringQuote = ''

	// Trim input first
	input = input.trim()

	for (let i = 0; i < input.length; i++) {
		const char = input[i]!

		switch (state) {
			case State.InHost: {
				if (char === '/') {
					currentHost = input.substring(hostStart, i)
					addressStart = i
					state = State.InAddress
				}
				break
			}

			case State.InAddress: {
				if (isWhiteSpace(char)) {
					currentAddress = input.substring(addressStart, i)
					state = State.AfterAddress
				} else if (char === ';') {
					commands.push({
						...parseHost(currentHost),
						address: input.substring(addressStart, i),
					})
					currentHost = ''
					currentAddress = ''
					state = State.AfterCommand
				}
				break
			}

			case State.AfterAddress: {
				if (isStringQuote(char)) {
					state = State.InString
					stringQuote = char
					argumentStart = i
				} else if (!isWhiteSpace(char)) {
					state = State.InArgument
					argumentStart = i
				}
				break
			}

			case State.InArgument: {
				if (isWhiteSpace(char) && i > argumentStart) {
					currentArgs.push(input.substring(argumentStart, i))
					state = State.AfterArgument
				} else if (char === ';') {
					currentArgs.push(input.substring(argumentStart, i))
					commands.push({
						...parseHost(currentHost),
						address: currentAddress,
						args: currentArgs.map(parseArgument),
					})
					currentArgs = []
					currentHost = ''
					currentAddress = ''
					state = State.AfterCommand
				}
				break
			}

			case State.InString: {
				if (char === stringQuote && input[i - 1] !== `\\`) {
					state = State.InArgument
				}
				break
			}

			case State.AfterArgument: {
				if (isStringQuote(char)) {
					state = State.InString
					stringQuote = char
					argumentStart = i
				} else if (!isWhiteSpace(char)) {
					argumentStart = i
					state = State.InArgument
				}
				break
			}

			case State.AfterCommand: {
				if (char === '/') {
					addressStart = i
					state = State.InAddress
				} else if (!isWhiteSpace(char)) {
					hostStart = i
					state = State.InHost
				}
			}
		}
	}

	if (state === State.InHost || state === State.InAddress) {
		commands.push({
			...parseHost(currentHost),
			address: input.substring(addressStart),
		})
	} else if (state === State.InArgument) {
		currentArgs.push(input.substring(argumentStart))
		commands.push({
			...parseHost(currentHost),
			address: currentAddress,
			args: currentArgs.map(parseArgument),
		})
	}

	return commands
}
