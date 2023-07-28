import {
	InstanceBase,
	runEntrypoint,
	InstanceStatus,
	SomeCompanionConfigField,
	combineRgb,
	CompanionButtonPresetDefinition,
	CompanionPresetDefinitions,
	Regex,
} from '@companion-module/base'

import { Client, Server, Message, MessageLike } from 'node-osc'
import { debounce, debounceGather } from './utils/debounce'
import { Action, Feedback } from './enums'

interface Config {
	/** The host registered in AbleSet for updates */
	clientHost: string
	/** The port used to listen to updates */
	clientPort: string
	/** The hostname or IP address to connect to  */
	serverHost: string
}

/**
 * Returns an array of numbers from 0 to, and including the given number.
 * @example makeRange(2) // returns [0, 1, 2]
 */
const makeRange = (number: number) =>
	Array(number)
		.fill(0)
		.map((_, i) => i)

const COLOR_BLACK = combineRgb(0, 0, 0)
const COLOR_GRAY = combineRgb(128, 128, 128)
const COLOR_WHITE = combineRgb(255, 255, 255)
const COLOR_GREEN_500 = combineRgb(34, 197, 94)
const COLOR_GREEN_700 = combineRgb(21, 128, 61)
const COLOR_GREEN_800 = combineRgb(22, 101, 52)

const PLAY_ICON = '<icon:play.png>'
const PAUSE_ICON_GREEN = '<icon:pause-green.png>'
const STOP_ICON_GREEN = '<icon:stop-green.png>'
const LOOP_ICON = '<icon:loop.png>'
const LOOP_ICON_GRAY = '<icon:loop-gray.png>'
const LOOP_ICON_GREEN = '<icon:loop-green.png>'

const PRESET_COUNT = 32

class ModuleInstance extends InstanceBase<Config> {
	config: Config = { clientHost: '127.0.0.1', clientPort: '39052', serverHost: '127.0.0.1' }
	oscServer: Server | null = null
	oscClient: Client | null = null

	connectInterval: NodeJS.Timeout | null = null

	songs: string[] = []
	sections: string[] = []

	constructor(internal: any) {
		super(internal)
	}

	async init(config: Config) {
		this.log('info', 'Initializing...')
		this.config = config

		if (
			config.serverHost !== '127.0.0.1' &&
			config.serverHost !== 'localhost' &&
			(!config.clientHost || config.clientHost === '127.0.0.1' || config.clientHost === 'localhost')
		) {
			this.updateStatus(
				InstanceStatus.BadConfig,
				"You must provide an IP address for AbleSet to send updates to when AbleSet isn't running on this machine, and it can't be 127.0.0.1 or localhost."
			)
			return
		}

		this.updateStatus(InstanceStatus.Connecting)

		try {
			const clientPort = Number(this.config.clientPort)

			if (isNaN(clientPort)) {
				throw new Error('Client port is not valid: ' + this.config.clientPort)
			}

			this.oscServer = new Server(clientPort, config.clientHost)
			this.oscClient = new Client(this.config.serverHost, 39051)
			this.log('info', `OSC client is sending to ${this.config.serverHost}:39051`)

			this.initOscListeners(this.oscServer)

			let isConnected = false

			const handleHeartbeat = debounce(() => {
				this.log('warn', 'Took too long between heartbeats, connection likely lost')
				this.updateStatus(InstanceStatus.Disconnected, "Didn't receive a heartbeat in a while")
				isConnected = false
			}, 2500)

			this.oscServer.once('/global/isPlaying', () => {
				isConnected = true
				this.log('info', 'Connection established')
				this.updateStatus(InstanceStatus.Ok)
			})

			this.oscServer.on('/heartbeat', () => {
				if (!isConnected) {
					isConnected = true
					this.log('info', 'Got another heartbeat, connection re-established')
					this.updateStatus(InstanceStatus.Ok)
				}
				handleHeartbeat()
			})

			this.oscServer.on('error', (error) => {
				this.log('error', String(error))
				console.error('OSC Error:', error)
				this.updateStatus(InstanceStatus.ConnectionFailure, error.message)
			})

			const tryConnecting = () => {
				this.log('info', 'Trying to connect to AbleSet...')
				this.sendOsc(['/subscribe', config.clientHost, clientPort, 'Companion'])
				this.sendOsc(['/getValues'])
			}

			await new Promise<void>((res) => {
				this.oscServer!.on('listening', () => {
					this.log('info', `OSC server is listening on port ${clientPort}`)
					res()
				})
			})

			handleHeartbeat()
			tryConnecting()

			this.connectInterval = setInterval(() => {
				if (!isConnected) {
					tryConnecting()
				}
			}, 2000)
		} catch (e: any) {
			console.error('OSC Init Error:', e)
			this.updateStatus(InstanceStatus.ConnectionFailure, String(e.message ?? e))
		}

		this.updateActions() // export actions
		this.updatePresets() // export presets
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}

	sendOsc(message: string | Message | MessageLike) {
		if (this.oscClient) {
			this.log('info', 'sending message: ' + JSON.stringify(message))
			this.oscClient.send(message)
		} else {
			this.log('error', "OSC client doesn't exist")
		}
	}

	/** Waits until all new OSC values are received before running updates */
	debouncedCheckFeedbacks = debounceGather<Feedback>((types) => this.checkFeedbacks(...types), 50)

	updateNextPreviousSongs = debounce(() => {
		const currentIndex = Number(this.getVariableValue('activeSongIndex'))

		this.setVariableValues({
			nextSongName: this.songs[currentIndex + 1],
			nextSongName2: this.songs[currentIndex + 2],
			nextSongName3: this.songs[currentIndex + 3],
			nextSongName4: this.songs[currentIndex + 4],
			previousSongName: this.songs[currentIndex - 1],
			previousSongName2: this.songs[currentIndex - 2],
			previousSongName3: this.songs[currentIndex - 3],
			previousSongName4: this.songs[currentIndex - 4],
		})
	}, 50)

	updateNextPreviousSections = debounce(() => {
		const currentIndex = Number(this.getVariableValue('activeSectionIndex'))

		this.setVariableValues({
			nextSectionName: this.sections[currentIndex + 1],
			nextSectionName2: this.sections[currentIndex + 2],
			nextSectionName3: this.sections[currentIndex + 3],
			nextSectionName4: this.sections[currentIndex + 4],
			previousSectionName: this.sections[currentIndex - 1],
			previousSectionName2: this.sections[currentIndex - 2],
			previousSectionName3: this.sections[currentIndex - 3],
			previousSectionName4: this.sections[currentIndex - 4],
		})
	}, 50)

	initOscListeners(server: Server) {
		//#region global
		server.on('/global/beatsPosition', ([, beats]) => {
			this.setVariableValues({ beatsPosition: Number(beats) })
			this.debouncedCheckFeedbacks(Feedback.IsInLoop, Feedback.IsInActiveLoop)
		})
		server.on('/global/humanPosition', ([, bars, beats]) => {
			this.setVariableValues({ humanPosition: `${bars ?? 0}.${beats ?? 0}` })
		})
		server.on('/global/tempo', ([, tempo]) => {
			this.setVariableValues({ tempo: Number(tempo) })
		})
		server.on('/global/isPlaying', ([, isPlaying]) => {
			this.setVariableValues({ isPlaying: Boolean(isPlaying) })
			this.debouncedCheckFeedbacks(Feedback.IsPlaying)
		})
		server.on('/global/timeSignature', ([, numerator, denominator]) => {
			this.setVariableValues({ timeSignature: `${numerator}/${denominator}` })
		})
		//#endregion

		//#region setlist
		server.on('/setlist/name', ([, name]) => {
			this.setVariableValues({ setlistName: String(name) })
		})
		server.on('/setlist/songs', ([, ...songs]) => {
			this.songs = songs as string[]
			this.setVariableValues(
				Object.fromEntries(makeRange(PRESET_COUNT).map((i) => [`song${i + 1}Name`, String(songs[i] ?? '')]))
			)
			this.debouncedCheckFeedbacks(Feedback.CanJumpToNextSong, Feedback.CanJumpToPreviousSong)
			this.updateNextPreviousSongs()
		})
		server.on('/setlist/sections', ([, ...sections]) => {
			this.sections = sections as string[]
			this.setVariableValues(
				Object.fromEntries(makeRange(PRESET_COUNT).map((i) => [`section${i + 1}Name`, String(sections[i] ?? '')]))
			)
			this.debouncedCheckFeedbacks(Feedback.CanJumpToNextSection, Feedback.CanJumpToPreviousSection)
			this.updateNextPreviousSections()
		})
		server.on('/setlist/activeSongName', ([, activeSongName]) => {
			this.setVariableValues({ activeSongName: String(activeSongName ?? '') })
		})
		server.on('/setlist/activeSongIndex', ([, activeSongIndex]) => {
			this.setVariableValues({ activeSongIndex: Number(activeSongIndex ?? -1) })
			this.debouncedCheckFeedbacks(
				Feedback.IsCurrentSong,
				Feedback.CanJumpToNextSong,
				Feedback.CanJumpToPreviousSong,
				Feedback.IsQueuedNextSong
			)
			this.updateNextPreviousSongs()
		})
		server.on('/setlist/activeSectionName', ([, activeSectionName]) => {
			this.setVariableValues({ activeSectionName: String(activeSectionName ?? '') })
		})
		server.on('/setlist/activeSectionIndex', ([, activeSectionIndex]) => {
			this.setVariableValues({ activeSectionIndex: Number(activeSectionIndex ?? -1) })
			this.debouncedCheckFeedbacks(
				Feedback.IsCurrentSection,
				Feedback.CanJumpToNextSection,
				Feedback.CanJumpToPreviousSection,
				Feedback.IsQueuedNextSection
			)
			this.updateNextPreviousSections()
		})
		server.on('/setlist/queuedName', ([, queuedSong, queuedSection]) => {
			this.setVariableValues({
				queuedSongName: String(queuedSong),
				queuedSectionName: String(queuedSection),
			})
		})
		server.on('/setlist/queuedIndex', ([, queuedSong, queuedSection]) => {
			this.setVariableValues({
				queuedSongIndex: Number(queuedSong),
				queuedSectionIndex: Number(queuedSection),
			})
			this.debouncedCheckFeedbacks(
				Feedback.IsQueuedSong,
				Feedback.IsQueuedSection,
				Feedback.IsQueuedNextSong,
				Feedback.IsQueuedNextSection
			)
		})
		server.on('/setlist/nextSongName', ([, nextSongName]) => {
			this.setVariableValues({ nextSongName: String(nextSongName) })
		})
		server.on('/setlist/nextSongIndex', ([, nextSongIndex]) => {
			this.setVariableValues({ nextSongIndex: Number(nextSongIndex) })
		})
		server.on('/setlist/loopEnabled', ([, loopEnabled]) => {
			this.setVariableValues({ loopEnabled: Boolean(loopEnabled) })
			this.debouncedCheckFeedbacks(Feedback.IsInLoop, Feedback.IsInActiveLoop)
		})
		server.on('/setlist/loopStart', ([, loopStart]) => {
			this.setVariableValues({ loopStart: Number(loopStart) })
			this.debouncedCheckFeedbacks(Feedback.IsInLoop, Feedback.IsInActiveLoop)
		})
		server.on('/setlist/loopEnd', ([, loopEnd]) => {
			this.setVariableValues({ loopEnd: Number(loopEnd) })
			this.debouncedCheckFeedbacks(Feedback.IsInLoop, Feedback.IsInActiveLoop)
		})
		server.on('/setlist/isCountingIn', ([, isCountingIn]) => {
			this.setVariableValues({ isCountingIn: Boolean(isCountingIn) })
		})
		//#endregion

		//#region PlayAUDIO12
		server.on('/playaudio12/isConnected', ([, connected]) => {
			this.setVariableValues({ playAudio12Connected: Boolean(connected) })
		})
		server.on('/playaudio12/scene', ([, scene]) => {
			this.setVariableValues({ playAudio12Scene: Number(scene) })
		})
		//#endregion

		//#region settings
		server.on('/settings/autoplay', ([, value]) => {
			this.setVariableValues({ autoplay: Boolean(value) })
		})
		server.on('/settings/safeMode', ([, value]) => {
			this.setVariableValues({ safeMode: Boolean(value) })
		})
		server.on('/settings/alwaysStopOnSongEnd', ([, value]) => {
			this.setVariableValues({ alwaysStopOnSongEnd: Boolean(value) })
		})
		server.on('/settings/autoJumpToNextSong', ([, value]) => {
			this.setVariableValues({ autoJumpToNextSong: Boolean(value) })
		})
		server.on('/settings/autoLoopCurrentSection', ([, value]) => {
			this.setVariableValues({ autoLoopCurrentSection: Boolean(value) })
		})
		server.on('/settings/countIn', ([, value]) => {
			this.setVariableValues({ countIn: Boolean(value) })
		})
		server.on('/settings/countInSoloClick', ([, value]) => {
			this.setVariableValues({ countInSoloClick: Boolean(value) })
		})
		server.on('/settings/countInDuration', ([, value]) => {
			this.setVariableValues({ countInDuration: Number(value) })
		})
		server.on('/settings/jumpMode', ([, value]) => {
			this.setVariableValues({ jumpMode: String(value) })
		})
		//#endregion
	}

	isInActiveLoop() {
		const pos = Number(this.getVariableValue('beatsPosition'))
		return (
			Boolean(this.getVariableValue('loopEnabled')) &&
			pos >= Number(this.getVariableValue('loopStart')) &&
			pos <= Number(this.getVariableValue('loopEnd'))
		)
	}

	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroying module...')
		this.sendOsc('/unsubscribe')

		if (this.connectInterval) {
			clearInterval(this.connectInterval)
		}

		await new Promise<void>((res) => this.oscClient?.close(res))
		await new Promise<void>((res) => this.oscServer?.close(res))
		this.log('debug', 'module destroyed')
	}

	async configUpdated(config: Config) {
		this.config = config
		this.log('info', 'got new config: ' + JSON.stringify(config))

		await this.destroy()
		await this.init(config)
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return [
			{
				id: 'clientHost',
				type: 'textinput',
				label: 'Client Host/IP',
				tooltip:
					"The IP address AbleSet should send updates to. Set the value to this computer's IP address if you run AbleSet on a different computer thank this one.",
				regex: Regex.HOSTNAME,
				default: '127.0.0.1',
				width: 4,
			},
			{
				id: 'clientPort',
				type: 'textinput',
				label: 'Client Port',
				tooltip: 'The port used to listen to status updates. Only change this if the default port causes issues.',
				regex: Regex.PORT,
				default: '39052',
				width: 4,
			},
			{
				id: 'serverHost',
				type: 'textinput',
				label: 'Server Host/IP',
				tooltip:
					'The host to connect to. Leave this as 127.0.0.1 if AbleSet is running on the same computer as Companion.',
				regex: Regex.HOSTNAME,
				default: '127.0.0.1',
				width: 4,
			},
		]
	}

	updateActions() {
		this.setActionDefinitions({
			//#region global
			[Action.Play]: {
				name: 'Play',
				options: [],
				callback: async () => this.sendOsc(['/global/play']),
			},
			[Action.Pause]: {
				name: 'Pause',
				options: [],
				callback: async () => this.sendOsc(['/global/pause']),
			},
			[Action.Stop]: {
				name: 'Stop',
				options: [],
				callback: async () => this.sendOsc(['/global/stop']),
			},
			[Action.PlayPause]: {
				name: 'Toggle Play/Pause',
				options: [],
				callback: async () => {
					if (this.getVariableValue('isPlaying')) {
						this.sendOsc(['/global/pause'])
					} else {
						this.sendOsc(['/global/play'])
					}
				},
			},
			[Action.PlayStop]: {
				name: 'Toggle Play/Stop',
				options: [],
				callback: async () => {
					if (this.getVariableValue('isPlaying')) {
						this.sendOsc(['/global/stop'])
					} else {
						this.sendOsc(['/global/play'])
					}
				},
			},
			//#endregion

			//#region setlist
			[Action.EnableLoop]: {
				name: 'Enable Loop',
				options: [],
				callback: async () => this.sendOsc(['/setlist/enableLoop']),
			},
			[Action.EscapeLoop]: {
				name: 'Escape Loop',
				options: [],
				callback: async () => this.sendOsc(['/setlist/escapeLoop']),
			},
			[Action.ToggleLoop]: {
				name: 'Toggle Loop',
				options: [],
				callback: async () => {
					if (this.isInActiveLoop()) {
						this.sendOsc(['/setlist/escapeLoop'])
					} else {
						this.sendOsc(['/setlist/enableLoop'])
					}
				},
			},
			[Action.JumpToSongByNumber]: {
				name: 'Jump to Song by Number',
				options: [
					{
						id: 'number',
						type: 'number',
						label: 'Song Number',
						min: 1,
						max: 1000,
						default: 1,
					},
				],
				callback: async (event) => this.sendOsc(['/setlist/jumpToSong', Number(event.options.number)]),
			},
			[Action.JumpToSongByName]: {
				name: 'Jump to Song by Name',
				options: [
					{
						id: 'name',
						type: 'textinput',
						label: 'Song Name',
						required: true,
					},
				],
				callback: async (event) => this.sendOsc(['/setlist/jumpToSong', String(event.options.name)]),
			},
			[Action.JumpBySongs]: {
				name: 'Jump by Songs',
				options: [
					{
						id: 'steps',
						type: 'number',
						label: 'Steps',
						tooltip: '1 jumps to the next song, -1 jumps to the previous song',
						min: -10,
						max: 10,
						default: 1,
					},
					{
						id: 'force',
						type: 'dropdown',
						label: 'Force Jump',
						tooltip: 'Ignores the current queued song',
						choices: [
							{ id: 'false', label: 'Disabled' },
							{ id: 'true', label: 'Enabled' },
						],
						default: 'false',
					},
				],
				callback: async (event) =>
					this.sendOsc([
						'/setlist/jumpBySongs',
						Number(event.options.steps),
						`force=${event.options.force ?? 'false'}`,
					]),
			},
			[Action.JumpToSectionByNumber]: {
				name: 'Jump to Section by Number',
				options: [
					{
						id: 'number',
						type: 'number',
						label: 'Section Number',
						min: 1,
						max: 1000,
						default: 1,
					},
				],
				callback: async (event) => this.sendOsc(['/setlist/jumpToSection', Number(event.options.number)]),
			},
			[Action.JumpToSectionByName]: {
				name: 'Jump to Section by Name',
				options: [
					{
						id: 'name',
						type: 'textinput',
						label: 'Section Name',
						required: true,
					},
				],
				callback: async (event) => this.sendOsc(['/setlist/jumpToSection', String(event.options.name)]),
			},
			[Action.JumpBySections]: {
				name: 'Jump by Sections',
				options: [
					{
						id: 'steps',
						type: 'number',
						label: 'Steps',
						tooltip: '1 jumps to the next section, -1 jumps to the previous section',
						min: -10,
						max: 10,
						default: 1,
					},
					{
						id: 'force',
						type: 'dropdown',
						label: 'Force Jump',
						tooltip: 'Ignores the current queued section',
						choices: [
							{ id: 'false', label: 'Disabled' },
							{ id: 'true', label: 'Enabled' },
						],
						default: 'false',
					},
				],
				callback: async (event) =>
					this.sendOsc([
						'/setlist/jumpBySections',
						Number(event.options.steps),
						`force=${event.options.force ?? 'false'}`,
					]),
			},
			[Action.PlayCuedSong]: {
				name: 'Play Cued Song',
				options: [],
				callback: async () => this.sendOsc(['/setlist/playCuedSong']),
			},
			//#endregion

			//#region PlayAUDIO12
			[Action.Pa12SetScene]: {
				name: 'PlayAUDIO12: Set Scene',
				options: [
					{
						id: 'scene',
						label: 'Scene',
						type: 'dropdown',
						choices: [
							{ id: 'A', label: 'Scene A' },
							{ id: 'B', label: 'Scene B' },
						],
						default: 'A',
					},
				],
				callback: async (event) => this.sendOsc(['/playaudio12/setScene', String(event.options.scene)]),
			},
			[Action.Pa12ToggleScene]: {
				name: 'PlayAUDIO12: Toggle Scene',
				options: [],
				callback: async () => this.sendOsc(['/playaudio12/toggleScene']),
			},
			//#endregion

			//#region settings
			[Action.SetAutoplay]: {
				name: 'Set Autoplay',
				options: [
					{
						id: 'value',
						label: 'Autoplay',
						type: 'checkbox',
						default: true,
					},
				],
				callback: async (event) => this.sendOsc(['/settings/autoplay', Number(event.options.value)]),
			},
			[Action.SetSafeMode]: {
				name: 'Set Safe Mode',
				options: [
					{
						id: 'value',
						label: 'Safe Mode',
						type: 'checkbox',
						default: true,
					},
				],
				callback: async (event) => this.sendOsc(['/settings/safeMode', Number(event.options.value)]),
			},
			[Action.SetAlwaysStopOnSongEnd]: {
				name: 'Set Always Stop on Song End',
				options: [
					{
						id: 'value',
						label: 'Always Stop on Song End',
						type: 'checkbox',
						default: true,
					},
				],
				callback: async (event) => this.sendOsc(['/settings/alwaysStopOnSongEnd', Number(event.options.value)]),
			},
			[Action.SetAutoJumpToNextSong]: {
				name: 'Set Autojump to the Next Song',
				options: [
					{
						id: 'value',
						label: 'Autojump to the Next Song',
						type: 'checkbox',
						default: true,
					},
				],
				callback: async (event) => this.sendOsc(['/settings/autoJumpToNextSong', Number(event.options.value)]),
			},
			[Action.SetAutoLoopCurrentSection]: {
				name: 'Set Autoloop the Current Section',
				options: [
					{
						id: 'value',
						label: 'Autoloop the Current Section',
						type: 'checkbox',
						default: true,
					},
				],
				callback: async (event) => this.sendOsc(['/settings/autoLoopCurrentSection', Number(event.options.value)]),
			},
			[Action.SetCountIn]: {
				name: 'Set Count-In',
				options: [
					{
						id: 'value',
						label: 'Count-In Enabled',
						type: 'checkbox',
						default: true,
					},
				],
				callback: async (event) => this.sendOsc(['/settings/countIn', Number(event.options.value)]),
			},
			[Action.SetCountInSoloClick]: {
				name: 'Set Solo Click During Count-In',
				options: [
					{
						id: 'value',
						label: 'Solo Click During Count-In',
						type: 'checkbox',
						default: true,
					},
				],
				callback: async (event) => this.sendOsc(['/settings/countInSoloClick', Number(event.options.value)]),
			},
			[Action.SetCountInDuration]: {
				name: 'Set Count-In Duration',
				options: [
					{
						id: 'value',
						label: 'Count-In Duration',
						type: 'dropdown',
						choices: [
							{ id: '1', label: '1 Bar' },
							{ id: '2', label: '2 Bars' },
							{ id: '4', label: '4 Bars' },
						],
						default: '1',
					},
				],
				callback: async (event) => this.sendOsc(['/settings/countInDuration', Number(event.options.value)]),
			},
			[Action.SetJumpMode]: {
				name: 'Set Jump Mode',
				options: [
					{
						id: 'value',
						label: 'Jump Mode',
						type: 'dropdown',
						choices: [
							{ id: 'quantized', label: 'Quantized' },
							{ id: 'end-of-section', label: 'End of Section' },
							{ id: 'end-of-song', label: 'End of Song' },
							{ id: 'manual', label: 'Manual' },
						],
						default: 'quantized',
					},
				],
				callback: async (event) => this.sendOsc(['/settings/jumpMode', String(event.options.value)]),
			},
			//#endregion
		})
	}

	updateVariableDefinitions() {
		this.setVariableDefinitions([
			{ variableId: 'beatsPosition', name: 'Playhead Position in Beats' },
			{ variableId: 'humanPosition', name: 'Playhead Position in Bars.Beats' },
			{ variableId: 'tempo', name: 'Current Tempo' },
			{ variableId: 'isPlaying', name: 'Is Playing' },
			{ variableId: 'timeSignature', name: 'Time Signature' },

			{ variableId: 'setlistName', name: 'Setlist Name' },
			{ variableId: 'activeSongName', name: 'Active Song Name' },
			{ variableId: 'activeSongIndex', name: 'Active Song Index' },
			{ variableId: 'queuedSongName', name: 'Queued Song Name' },
			{ variableId: 'queuedSongIndex', name: 'Queued Song Index' },

			{ variableId: 'activeSectionName', name: 'Active Section Name' },
			{ variableId: 'activeSectionIndex', name: 'Active Section Index' },
			{ variableId: 'queuedSectionName', name: 'Queued Section Name' },
			{ variableId: 'queuedSectionIndex', name: 'Queued Section Index' },
			{ variableId: 'nextSongName', name: 'Next Song Name' },
			{ variableId: 'nextSongIndex', name: 'Next Song Index' },

			...Array(PRESET_COUNT)
				.fill(0)
				.map((_, i) => ({ variableId: `song${i + 1}Name`, name: `Song ${i + 1} Name` })),
			...Array(PRESET_COUNT)
				.fill(0)
				.map((_, i) => ({ variableId: `section${i + 1}Name`, name: `Section ${i + 1} Name` })),

			{ variableId: 'nextSongName', name: 'Next Song Name' },
			{ variableId: 'nextSongName2', name: '2nd Next Song Name' },
			{ variableId: 'nextSongName3', name: '3rd Next Song Name' },
			{ variableId: 'nextSongName4', name: '4th Next Song Name' },
			{ variableId: 'previousSongName', name: 'Previous Song Name' },
			{ variableId: 'previousSongName2', name: '2nd Previous Song Name' },
			{ variableId: 'previousSongName3', name: '3rd Previous Song Name' },
			{ variableId: 'previousSongName4', name: '4th Previous Song Name' },

			{ variableId: 'nextSectionName', name: 'Next Section Name' },
			{ variableId: 'nextSectionName2', name: '2nd Next Section Name' },
			{ variableId: 'nextSectionName3', name: '3rd Next Section Name' },
			{ variableId: 'nextSectionName4', name: '4th Next Section Name' },
			{ variableId: 'previousSectionName', name: 'Previous Section Name' },
			{ variableId: 'previousSectionName2', name: '2nd Previous Section Name' },
			{ variableId: 'previousSectionName3', name: '3rd Previous Section Name' },
			{ variableId: 'previousSectionName4', name: '4th Previous Section Name' },

			{ variableId: 'loopEnabled', name: 'Loop Enabled' },
			{ variableId: 'loopStart', name: 'Loop Start' },
			{ variableId: 'loopEnd', name: 'Loop End' },
			{ variableId: 'isCountingIn', name: 'Is Counting In' },

			{ variableId: 'playAudio12Connected', name: 'PlayAUDIO12 Connected' },
			{ variableId: 'playAudio12Scene', name: 'PlayAUDIO12 Scene' },

			{ variableId: 'autoplay', name: 'Autoplay' },
			{ variableId: 'safeMode', name: 'Safe Mode' },
			{ variableId: 'alwaysStopOnSongEnd', name: 'Always Stop on Song End' },
			{ variableId: 'autoJumpToNextSong', name: 'Autojump to the Next Song' },
			{ variableId: 'autoLoopCurrentSection', name: 'Autoloop the Current Section' },
			{ variableId: 'countIn', name: 'Count-In' },
			{ variableId: 'countInSoloClick', name: 'Solo Click During Count-In' },
			{ variableId: 'countInDuration', name: 'Count-In Duration' },
			{ variableId: 'jumpMode', name: 'Jump Mode' },
		])
	}

	updateFeedbacks() {
		this.setFeedbackDefinitions({
			[Feedback.IsPlaying]: {
				type: 'boolean',
				name: 'Playing',
				defaultStyle: { bgcolor: COLOR_GREEN_500 },
				callback: () => {
					return Boolean(this.getVariableValue('isPlaying'))
				},
				options: [],
			},

			[Feedback.IsInLoop]: {
				type: 'boolean',
				name: 'Is in Loop',
				defaultStyle: { bgcolor: COLOR_GREEN_500 },
				callback: () => {
					const pos = Number(this.getVariableValue('beatsPosition'))
					return pos >= Number(this.getVariableValue('loopStart')) && pos <= Number(this.getVariableValue('loopEnd'))
				},
				options: [],
			},

			[Feedback.IsInActiveLoop]: {
				type: 'boolean',
				name: 'Is in Active Loop',
				defaultStyle: { bgcolor: COLOR_GREEN_500 },
				callback: () => this.isInActiveLoop(),
				options: [],
			},

			[Feedback.IsCurrentSong]: {
				type: 'boolean',
				name: 'Is Current Song',
				defaultStyle: { bgcolor: COLOR_GREEN_500 },
				callback: (feedback) => {
					return Number(this.getVariableValue('activeSongIndex')) === Number(feedback.options.songNumber) - 1
				},
				options: [
					{
						id: 'songNumber',
						label: 'Song Number',
						type: 'number',
						min: 1,
						max: 100,
						default: 1,
					},
				],
			},

			[Feedback.IsCurrentSection]: {
				type: 'boolean',
				name: 'Is Current Section',
				defaultStyle: { bgcolor: COLOR_GREEN_500 },
				callback: (feedback) => {
					return Number(this.getVariableValue('activeSectionIndex')) === Number(feedback.options.sectionNumber) - 1
				},
				options: [
					{
						id: 'sectionNumber',
						label: 'Section Number',
						type: 'number',
						min: 1,
						max: 100,
						default: 1,
					},
				],
			},

			[Feedback.IsQueuedSong]: {
				type: 'boolean',
				name: 'Is Queued Song',
				defaultStyle: { bgcolor: COLOR_GREEN_500 },
				callback: (feedback) => {
					return (
						this.getVariableValue('queuedSongIndex') !== '' &&
						Number(this.getVariableValue('queuedSongIndex')) === Number(feedback.options.songNumber) - 1
					)
				},
				options: [
					{
						id: 'songNumber',
						label: 'Song Number',
						type: 'number',
						min: 1,
						max: 100,
						default: 1,
					},
				],
			},

			[Feedback.IsQueuedSection]: {
				type: 'boolean',
				name: 'Is Queued Section',
				defaultStyle: { bgcolor: COLOR_GREEN_500 },
				callback: (feedback) => {
					return (
						this.getVariableValue('queuedSectionIndex') !== '' &&
						Number(this.getVariableValue('queuedSectionIndex')) === Number(feedback.options.sectionNumber) - 1
					)
				},
				options: [
					{
						id: 'sectionNumber',
						label: 'Section Number',
						type: 'number',
						min: 1,
						max: 100,
						default: 1,
					},
				],
			},

			[Feedback.IsQueuedNextSong]: {
				type: 'boolean',
				name: 'Is Queued Next Song',
				defaultStyle: { bgcolor: COLOR_GREEN_500 },
				callback: (feedback) => {
					const queuedSongIndex = Number(this.getVariableValue('queuedSongIndex') ?? -1)
					const activeSongIndex = Number(this.getVariableValue('activeSongIndex') ?? -1)
					const songIndex = activeSongIndex + Number(feedback.options.songDelta)
					this.log('info', 'Queued song: ' + JSON.stringify({ queuedSongIndex, activeSongIndex, songIndex }))
					return queuedSongIndex !== -1 && queuedSongIndex === songIndex
				},
				options: [
					{
						id: 'songDelta',
						label: 'Song Delta',
						tooltip: 'e.g. 1 for the next song, -1 for the previous song',
						type: 'number',
						min: -100,
						max: 100,
						default: 1,
					},
				],
			},

			[Feedback.IsQueuedNextSection]: {
				type: 'boolean',
				name: 'Is Queued Next Section',
				defaultStyle: { bgcolor: COLOR_GREEN_500 },
				callback: (feedback) => {
					const queuedSectionIndex = Number(this.getVariableValue('queuedSectionIndex') ?? -1)
					const activeSectionIndex = Number(this.getVariableValue('activeSectionIndex') ?? -1)
					const sectionIndex = activeSectionIndex + Number(feedback.options.sectionDelta)
					this.log(
						'info',
						'Queued section: ' + JSON.stringify({ queuedSectionIndex, activeSectionIndex, sectionIndex })
					)
					return queuedSectionIndex !== -1 && queuedSectionIndex === sectionIndex
				},
				options: [
					{
						id: 'sectionDelta',
						label: 'Section Delta',
						tooltip: 'e.g. 1 for the next section, -1 for the previous section',
						type: 'number',
						min: -100,
						max: 100,
						default: 1,
					},
				],
			},

			[Feedback.CanJumpToNextSong]: {
				type: 'boolean',
				name: 'Can Jump to Next Song',
				defaultStyle: { color: COLOR_WHITE },
				callback: () => {
					return Number(this.getVariableValue('activeSongIndex')) < this.songs.length - 1
				},
				options: [],
			},

			[Feedback.CanJumpToPreviousSong]: {
				type: 'boolean',
				name: 'Can Jump to Previous Song',
				defaultStyle: { color: COLOR_WHITE },
				callback: () => {
					return Number(this.getVariableValue('activeSongIndex')) > 0
				},
				options: [],
			},

			[Feedback.CanJumpToNextSection]: {
				type: 'boolean',
				name: 'Can Jump to Next Section',
				defaultStyle: { color: COLOR_WHITE },
				callback: () => {
					return Number(this.getVariableValue('activeSectionIndex')) < this.sections.length - 1
				},
				options: [],
			},

			[Feedback.CanJumpToPreviousSection]: {
				type: 'boolean',
				name: 'Can Jump to Previous Section',
				defaultStyle: { color: COLOR_WHITE },
				callback: () => {
					return Number(this.getVariableValue('activeSectionIndex')) > 0
				},
				options: [],
			},
		})
	}

	updatePresets() {
		const defaultSongStyle = { bgcolor: COLOR_BLACK, color: COLOR_WHITE, size: '14' } as const
		const defaultStyle = { bgcolor: COLOR_BLACK, color: COLOR_WHITE, size: '18' } as const

		const songPresets = Object.fromEntries(
			makeRange(PRESET_COUNT).map((i) => [
				`song${i + 1}`,
				{
					category: 'Songs',
					name: `Song ${i + 1}`,
					type: 'button',
					previewStyle: { ...defaultSongStyle, text: `Song ${i + 1}` },
					style: { ...defaultSongStyle, text: `$(AbleSet:song${i + 1}Name)` },
					steps: [{ down: [{ actionId: Action.JumpToSongByNumber, options: { number: i + 1 } }], up: [] }],
					feedbacks: [
						{
							feedbackId: Feedback.IsQueuedSong,
							options: { songNumber: i + 1 },
							style: { bgcolor: COLOR_GREEN_800 },
						},
						{
							feedbackId: Feedback.IsCurrentSong,
							options: { songNumber: i + 1 },
							style: { bgcolor: COLOR_GREEN_500 },
						},
					],
				} as CompanionButtonPresetDefinition,
			])
		)

		const sectionPresets = Object.fromEntries(
			makeRange(PRESET_COUNT).map((i) => [
				`section${i + 1}`,
				{
					category: 'Sections',
					name: `Section ${i + 1}`,
					type: 'button',
					previewStyle: { ...defaultSongStyle, text: `Section ${i + 1}` },
					style: { ...defaultSongStyle, text: `$(AbleSet:section${i + 1}Name)` },
					steps: [{ down: [{ actionId: Action.JumpToSectionByNumber, options: { number: i + 1 } }], up: [] }],
					feedbacks: [
						{
							feedbackId: Feedback.IsQueuedSection,
							options: { sectionNumber: i + 1 },
							style: { bgcolor: COLOR_GREEN_800 },
						},
						{
							feedbackId: Feedback.IsCurrentSection,
							options: { sectionNumber: i + 1 },
							style: { bgcolor: COLOR_GREEN_500 },
						},
					],
				} as CompanionButtonPresetDefinition,
			])
		)

		const nextPrevSongs: CompanionPresetDefinitions = {
			currentSong: {
				category: 'Jump Songs',
				name: 'Current Song',
				type: 'button',
				previewStyle: { ...defaultStyle, bgcolor: COLOR_GREEN_500, text: `Current Song` },
				style: { ...defaultStyle, bgcolor: COLOR_GREEN_500, text: `$(AbleSet:activeSongName)` },
				steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 0, force: 'true' } }], up: [] }],
				feedbacks: [
					{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: 0 }, style: { bgcolor: COLOR_GREEN_800 } },
				],
			},
			nextSong1: {
				category: 'Jump Songs',
				name: 'Next Song',
				type: 'button',
				previewStyle: { ...defaultStyle, text: `Next Song` },
				style: { ...defaultStyle, text: `$(AbleSet:nextSongName)` },
				steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 1, force: 'true' } }], up: [] }],
				feedbacks: [
					{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: 1 }, style: { bgcolor: COLOR_GREEN_800 } },
				],
			},
			nextSong2: {
				category: 'Jump Songs',
				name: '2nd Next Song',
				type: 'button',
				previewStyle: { ...defaultStyle, text: `2nd Next Song` },
				style: { ...defaultStyle, text: `$(AbleSet:nextSongName2)` },
				steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 2, force: 'true' } }], up: [] }],
				feedbacks: [
					{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: 2 }, style: { bgcolor: COLOR_GREEN_800 } },
				],
			},
			nextSong3: {
				category: 'Jump Songs',
				name: '3rd Next Song',
				type: 'button',
				previewStyle: { ...defaultStyle, text: `3rd Next Song` },
				style: { ...defaultStyle, text: `$(AbleSet:nextSongName3)` },
				steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 3, force: 'true' } }], up: [] }],
				feedbacks: [
					{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: 3 }, style: { bgcolor: COLOR_GREEN_800 } },
				],
			},
			nextSong4: {
				category: 'Jump Songs',
				name: '4th Next Song',
				type: 'button',
				previewStyle: { ...defaultStyle, text: `4th Next Song` },
				style: { ...defaultStyle, text: `$(AbleSet:nextSongName4)` },
				steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 4, force: 'true' } }], up: [] }],
				feedbacks: [
					{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: 4 }, style: { bgcolor: COLOR_GREEN_800 } },
				],
			},
			previousSong1: {
				category: 'Jump Songs',
				name: 'Previous Song',
				type: 'button',
				previewStyle: { ...defaultStyle, text: `Prev Song` },
				style: { ...defaultStyle, text: `$(AbleSet:previousSongName)` },
				steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: -1, force: 'true' } }], up: [] }],
				feedbacks: [
					{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: -1 }, style: { bgcolor: COLOR_GREEN_800 } },
				],
			},
			previousSong2: {
				category: 'Jump Songs',
				name: '2nd Previous Song',
				type: 'button',
				previewStyle: { ...defaultStyle, text: `2nd Prev Song` },
				style: { ...defaultStyle, text: `$(AbleSet:previousSongName2)` },
				steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: -2, force: 'true' } }], up: [] }],
				feedbacks: [
					{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: -2 }, style: { bgcolor: COLOR_GREEN_800 } },
				],
			},
			previousSong3: {
				category: 'Jump Songs',
				name: '3rd Previous Song',
				type: 'button',
				previewStyle: { ...defaultStyle, text: `3rd Prev Song` },
				style: { ...defaultStyle, text: `$(AbleSet:previousSongName3)` },
				steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: -3, force: 'true' } }], up: [] }],
				feedbacks: [
					{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: -3 }, style: { bgcolor: COLOR_GREEN_800 } },
				],
			},
			previousSong4: {
				category: 'Jump Songs',
				name: '4th Previous Song',
				type: 'button',
				previewStyle: { ...defaultStyle, text: `4th Prev Song` },
				style: { ...defaultStyle, text: `$(AbleSet:previousSongName4)` },
				steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: -4, force: 'true' } }], up: [] }],
				feedbacks: [
					{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: -4 }, style: { bgcolor: COLOR_GREEN_800 } },
				],
			},
		}

		const nextPrevSections: CompanionPresetDefinitions = {
			currentSection: {
				category: 'Jump Sections',
				name: 'Current Section',
				type: 'button',
				previewStyle: { ...defaultStyle, bgcolor: COLOR_GREEN_500, text: `Current Section` },
				style: { ...defaultStyle, bgcolor: COLOR_GREEN_500, text: `$(AbleSet:activeSectionName)` },
				steps: [{ down: [{ actionId: Action.JumpBySections, options: { steps: 0, force: 'true' } }], up: [] }],
				feedbacks: [
					{
						feedbackId: Feedback.IsQueuedNextSection,
						options: { sectionDelta: 0 },
						style: { bgcolor: COLOR_GREEN_800 },
					},
				],
			},
			nextSection1: {
				category: 'Jump Sections',
				name: 'Next Section',
				type: 'button',
				previewStyle: { ...defaultStyle, text: `Next Section` },
				style: { ...defaultStyle, text: `$(AbleSet:nextSectionName)` },
				steps: [{ down: [{ actionId: Action.JumpBySections, options: { steps: 1, force: 'true' } }], up: [] }],
				feedbacks: [
					{
						feedbackId: Feedback.IsQueuedNextSection,
						options: { sectionDelta: 1 },
						style: { bgcolor: COLOR_GREEN_800 },
					},
				],
			},
			nextSection2: {
				category: 'Jump Sections',
				name: '2nd Next Section',
				type: 'button',
				previewStyle: { ...defaultStyle, text: `2nd Next Section` },
				style: { ...defaultStyle, text: `$(AbleSet:nextSectionName2)` },
				steps: [{ down: [{ actionId: Action.JumpBySections, options: { steps: 2, force: 'true' } }], up: [] }],
				feedbacks: [
					{
						feedbackId: Feedback.IsQueuedNextSection,
						options: { sectionDelta: 2 },
						style: { bgcolor: COLOR_GREEN_800 },
					},
				],
			},
			nextSection3: {
				category: 'Jump Sections',
				name: '3rd Next Section',
				type: 'button',
				previewStyle: { ...defaultStyle, text: `3rd Next Section` },
				style: { ...defaultStyle, text: `$(AbleSet:nextSectionName3)` },
				steps: [{ down: [{ actionId: Action.JumpBySections, options: { steps: 3, force: 'true' } }], up: [] }],
				feedbacks: [
					{
						feedbackId: Feedback.IsQueuedNextSection,
						options: { sectionDelta: 3 },
						style: { bgcolor: COLOR_GREEN_800 },
					},
				],
			},
			nextSection4: {
				category: 'Jump Sections',
				name: '4th Next Section',
				type: 'button',
				previewStyle: { ...defaultStyle, text: `4th Next Section` },
				style: { ...defaultStyle, text: `$(AbleSet:nextSectionName4)` },
				steps: [{ down: [{ actionId: Action.JumpBySections, options: { steps: 4, force: 'true' } }], up: [] }],
				feedbacks: [
					{
						feedbackId: Feedback.IsQueuedNextSection,
						options: { sectionDelta: 4 },
						style: { bgcolor: COLOR_GREEN_800 },
					},
				],
			},
			previousSection1: {
				category: 'Jump Sections',
				name: 'Previous Section',
				type: 'button',
				previewStyle: { ...defaultStyle, text: `Prev Section` },
				style: { ...defaultStyle, text: `$(AbleSet:previousSectionName)` },
				steps: [{ down: [{ actionId: Action.JumpBySections, options: { steps: -1, force: 'true' } }], up: [] }],
				feedbacks: [
					{
						feedbackId: Feedback.IsQueuedNextSection,
						options: { sectionDelta: -1 },
						style: { bgcolor: COLOR_GREEN_800 },
					},
				],
			},
			previousSection2: {
				category: 'Jump Sections',
				name: '2nd Previous Section',
				type: 'button',
				previewStyle: { ...defaultStyle, text: `2nd Prev Section` },
				style: { ...defaultStyle, text: `$(AbleSet:previousSectionName2)` },
				steps: [{ down: [{ actionId: Action.JumpBySections, options: { steps: -2, force: 'true' } }], up: [] }],
				feedbacks: [
					{
						feedbackId: Feedback.IsQueuedNextSection,
						options: { sectionDelta: -2 },
						style: { bgcolor: COLOR_GREEN_800 },
					},
				],
			},
			previousSection3: {
				category: 'Jump Sections',
				name: '3rd Previous Section',
				type: 'button',
				previewStyle: { ...defaultStyle, text: `3rd Prev Section` },
				style: { ...defaultStyle, text: `$(AbleSet:previousSectionName3)` },
				steps: [{ down: [{ actionId: Action.JumpBySections, options: { steps: -3, force: 'true' } }], up: [] }],
				feedbacks: [
					{
						feedbackId: Feedback.IsQueuedNextSection,
						options: { sectionDelta: -3 },
						style: { bgcolor: COLOR_GREEN_800 },
					},
				],
			},
			previousSection4: {
				category: 'Jump Sections',
				name: '4th Previous Section',
				type: 'button',
				previewStyle: { ...defaultStyle, text: `4th Prev Section` },
				style: { ...defaultStyle, text: `$(AbleSet:previousSectionName4)` },
				steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: -4, force: 'true' } }], up: [] }],
				feedbacks: [
					{
						feedbackId: Feedback.IsQueuedNextSection,
						options: { sectionDelta: -4 },
						style: { bgcolor: COLOR_GREEN_800 },
					},
				],
			},
		}

		const playbackPresets: CompanionPresetDefinitions = {
			playPause: {
				category: 'Playback',
				name: 'Toggle Play/Pause',
				type: 'button',
				style: { ...defaultStyle, text: '', png64: PLAY_ICON },
				steps: [{ down: [{ actionId: Action.PlayPause, options: {} }], up: [] }],
				feedbacks: [
					{
						feedbackId: Feedback.IsPlaying,
						options: {},
						style: { bgcolor: COLOR_GREEN_700, png64: PAUSE_ICON_GREEN },
					},
				],
			},
			playStop: {
				category: 'Playback',
				name: 'Toggle Play/Stop',
				type: 'button',
				style: { ...defaultStyle, text: '', png64: PLAY_ICON },
				steps: [{ down: [{ actionId: Action.PlayStop, options: {} }], up: [] }],
				feedbacks: [
					{
						feedbackId: Feedback.IsPlaying,
						options: {},
						style: { bgcolor: COLOR_GREEN_700, png64: STOP_ICON_GREEN },
					},
				],
			},
			prevSong: {
				category: 'Playback',
				name: 'Previous Song',
				type: 'button',
				style: { ...defaultStyle, color: COLOR_GRAY, text: '<\nSong' },
				steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: -1 } }], up: [] }],
				feedbacks: [{ feedbackId: Feedback.CanJumpToPreviousSong, options: {}, style: { color: COLOR_WHITE } }],
			},
			nextSong: {
				category: 'Playback',
				name: 'Next Song',
				type: 'button',
				style: { ...defaultStyle, color: COLOR_GRAY, text: '>\nSong' },
				steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 1 } }], up: [] }],
				feedbacks: [{ feedbackId: Feedback.CanJumpToNextSong, options: {}, style: { color: COLOR_WHITE } }],
			},
			prevSection: {
				category: 'Playback',
				name: 'Previous Section',
				type: 'button',
				style: { ...defaultStyle, color: COLOR_GRAY, text: '<\nSection' },
				steps: [{ down: [{ actionId: Action.JumpBySections, options: { steps: -1 } }], up: [] }],
				feedbacks: [{ feedbackId: Feedback.CanJumpToPreviousSection, options: {}, style: { color: COLOR_WHITE } }],
			},
			nextSection: {
				category: 'Playback',
				name: 'Next Section',
				type: 'button',
				style: { ...defaultStyle, color: COLOR_GRAY, text: '>\nSection' },
				steps: [{ down: [{ actionId: Action.JumpBySections, options: { steps: 1 } }], up: [] }],
				feedbacks: [{ feedbackId: Feedback.CanJumpToNextSection, options: {}, style: { color: COLOR_WHITE } }],
			},
			toggleLoop: {
				category: 'Playback',
				name: 'Toggle Loop',
				type: 'button',
				style: { ...defaultStyle, color: COLOR_GRAY, text: '', png64: LOOP_ICON_GRAY },
				steps: [{ down: [{ actionId: Action.ToggleLoop, options: {} }], up: [] }],
				feedbacks: [
					{ feedbackId: Feedback.IsInLoop, options: {}, style: { png64: LOOP_ICON } },
					{
						feedbackId: Feedback.IsInActiveLoop,
						options: {},
						style: { bgcolor: COLOR_GREEN_700, png64: LOOP_ICON_GREEN },
					},
				],
			},
		}

		this.setPresetDefinitions({
			...songPresets,
			...sectionPresets,
			...nextPrevSongs,
			...nextPrevSections,
			...playbackPresets,
		})
	}
}

runEntrypoint(ModuleInstance, [])
