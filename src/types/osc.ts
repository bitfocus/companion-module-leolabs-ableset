export interface Argument {
	type: 'integer' | 'float' | 'string' | 'boolean' | 'blob' | 'null'
	value: boolean | number | string | null
	quoted?: boolean
}

export type ArgumentType = null | boolean | number | string | Argument
