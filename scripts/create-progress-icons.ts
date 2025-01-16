import fs from 'fs'
import path from 'path'
import { Image, createCanvas, loadImage } from 'canvas'

const run = async () => {
	const count = Number(process.argv[2])
	const pixelsPerStep = 72 / count

	if (isNaN(count)) {
		console.error(process.argv[2], 'is not a number')
		process.exit(1)
	}

	const dir = path.join('icons', 'progress', String(count))
	const fullDir = path.join(dir, 'full')
	fs.mkdirSync(fullDir, { recursive: true })

	const styles = fs
		.readdirSync(path.join(__dirname, 'progress-styles'))
		.filter((s) => !s.startsWith('.'))
		.map((s) => s.replace('.png', ''))
	const styleImages: Record<string, Image> = {}

	for (const style of styles) {
		fs.mkdirSync(path.join(dir, style), { recursive: true })
		styleImages[style] = await loadImage(path.join(__dirname, 'progress-styles', `${style}.png`))
	}

	const canvas = createCanvas(72, 72)
	const context = canvas.getContext('2d')

	for (let i = 0; i <= count; i++) {
		context.clearRect(0, 0, 72, 72)
		context.fillStyle = '#000'
		context.fillRect(pixelsPerStep * i, 0, 72, 72)
		const full = canvas.toBuffer('image/png')
		fs.writeFileSync(path.join(dir, 'full', `${i}.png`), full)

		for (const style of styles) {
			context.clearRect(0, 0, 72, 72)
			context.fillStyle = 'rgba(0,0,0,0.7)'
			context.fillRect(pixelsPerStep * i, 0, 72, 72)
			context.drawImage(styleImages[style], 0, 0)
			const buffer = canvas.toBuffer('image/png')
			fs.writeFileSync(path.join(dir, style, `${i}.png`), buffer)
		}
	}
}

run()
