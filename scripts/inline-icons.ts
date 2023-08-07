import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const iconPath = join(__dirname, '..', 'icons')
const mainPath = join(__dirname, '..', 'dist', 'icons.js')

let mainCode = readFileSync(mainPath, 'utf-8')
const singleMatches = mainCode.matchAll(/\<icon:(.+?)\>/g)

for (const match of singleMatches) {
	const path = join(iconPath, match[1])
	mainCode = mainCode.replace(match[0], readFileSync(path, 'base64'))
}

const dirMatches = mainCode.matchAll(/'\<icon-dir:(.+?)\>'/g)

for (const match of dirMatches) {
	const dirPath = join(iconPath, match[1])
	const files = readdirSync(dirPath).sort((a, b) => Number(a.split('.')[0]) - Number(b.split('.')[0]))

	const contents = files.map((f) => readFileSync(join(dirPath, f), 'base64'))
	mainCode = mainCode.replace(match[0], contents.map((c) => `'${c}'`).join(','))
}

writeFileSync(mainPath, mainCode)
