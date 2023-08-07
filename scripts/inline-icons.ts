import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const iconPath = join(__dirname, '..', 'icons')
const mainPath = join(__dirname, '..', 'dist', 'icons.js')

let mainCode = readFileSync(mainPath, 'utf-8')
const matches = mainCode.matchAll(/\<icon:(.+?)\>/g)

for (const match of matches) {
	const path = join(iconPath, match[1])
	mainCode = mainCode.replace(match[0], readFileSync(path, 'base64'))
}

writeFileSync(mainPath, mainCode)
