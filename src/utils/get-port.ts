import { AddressInfo, createServer } from 'node:net'

export async function getPort(): Promise<number> {
	return new Promise((resolve, reject) => {
		const server = createServer()
		server.unref()
		server.on('error', reject)
		server.listen(() => {
			const { port } = server.address() as AddressInfo

			server.close(() => {
				resolve(port)
			})
		})
	})
}
