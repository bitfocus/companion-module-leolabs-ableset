import { InstanceBase, InstanceStatus, SomeCompanionConfigField, runEntrypoint } from '@companion-module/base'
import { ArgumentType, Client, Server } from 'node-osc'
import shortUuid from 'short-uuid'

import { BOOLEAN_SETTINGS, COUNT_IN_DURATIONS, JUMP_MODES, SECTION_PRESET_COUNT, SONG_PRESET_COUNT } from './constants'
import { Action, Feedback } from './enums'
import { presets } from './presets'
import { COLOR_GREEN_500, COLOR_GREEN_800, COLOR_RED_600, COLOR_WHITE, COLORS } from './utils/colors'
import { debounceGather } from './utils/debounce'
import { makeRange } from './utils/range'
import { variables } from './variables'
import { getProgressIcon } from './icons'
import { debounce, throttle } from 'lodash'

/** The port that AbleSet is listening on */
const SERVER_PORT = 39041

interface Config {
	/** The hostname(s) or IP address(es) to connect to, comma-separated */
	serverHost: string
	/** Whether to request fine  */
	fineUpdates: boolean
}

class ModuleInstance extends InstanceBase<Config> {
	config: Config = { serverHost: '127.0.0.1', fineUpdates: true }
	oscServer: Server | null = null
	oscClients: Client[] = []

	connectInterval: NodeJS.Timeout | null = null
	cancelHeartbeat = () => {}

	songs: string[] = []
	sections: string[] = []
	sectionColors: number[] = []
	activeSongName = ''
	activeSongIndex = -1
	activeSectionName = ''
	activeSectionIndex = -1

	constructor(internal: any) {
		super(internal)
	}

	async init(config: Config) {
		this.log('info', 'Initializing...')
		this.config = config

		this.updateStatus(InstanceStatus.Connecting)

		try {
			this.oscClients = config.serverHost.split(',').map((h) => new Client(h.trim(), 39051))
			this.oscServer = new Server(39041, '0.0.0.0')

			const serverStrings = this.config.serverHost.split(',').map((h) => `${h.trim()}:39051`)
			this.log('info', `OSC client is sending to ${serverStrings.join(', ')}`)

			this.initOscListeners(this.oscServer)

			let isConnected = false

			const handleHeartbeat = debounce(() => {
				this.log('warn', 'Took too long between heartbeats, connection likely lost')
				this.updateStatus(InstanceStatus.Disconnected, "Didn't receive a heartbeat in a while")
				isConnected = false
			}, 2500)

			this.cancelHeartbeat = () => handleHeartbeat.cancel()

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
				this.sendOsc(['/subscribe', 'auto', SERVER_PORT, 'Companion', config.fineUpdates ?? false])
				this.sendOsc(['/getValues', SERVER_PORT])
			}

			await new Promise<void>((res) => {
				this.oscServer!.on('listening', () => {
					this.log('info', `OSC server is listening on port ${SERVER_PORT}`)
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

	sendOsc(message: [string, ...ArgumentType[]]) {
		if (this.oscClients.length) {
			// Give each message a unique UUID
			message.push('uuid=' + shortUuid().new())
			this.log('info', 'sending message: ' + JSON.stringify(message))
			for (const client of this.oscClients) {
				client.send(message)
			}
		} else {
			this.log('error', "OSC client doesn't exist")
		}
	}

	/** Waits until all new OSC values are received before running updates */
	debouncedCheckFeedbacks = debounceGather<Feedback>((types) => this.checkFeedbacks(...types), 30)

	updateSongs = debounce(() => {
		const currentIndex = this.activeSongIndex

		this.setVariableValues({
			activeSongName: this.activeSongName,
			activeSongIndex: this.activeSongIndex,
			nextSongName: this.songs[currentIndex + 1],
			nextSongName2: this.songs[currentIndex + 2],
			nextSongName3: this.songs[currentIndex + 3],
			nextSongName4: this.songs[currentIndex + 4],
			nextSongName5: this.songs[currentIndex + 5],
			nextSongName6: this.songs[currentIndex + 6],
			nextSongName7: this.songs[currentIndex + 7],
			nextSongName8: this.songs[currentIndex + 8],
			previousSongName: this.songs[currentIndex - 1],
			previousSongName2: this.songs[currentIndex - 2],
			previousSongName3: this.songs[currentIndex - 3],
			previousSongName4: this.songs[currentIndex - 4],
			previousSongName5: this.songs[currentIndex - 5],
			previousSongName6: this.songs[currentIndex - 6],
			previousSongName7: this.songs[currentIndex - 7],
			previousSongName8: this.songs[currentIndex - 8],
		})
	}, 20)

	updateSections = debounce(() => {
		const currentIndex = this.activeSectionIndex

		this.setVariableValues({
			activeSectionName: this.activeSectionName,
			activeSectionIndex: this.activeSectionIndex,
			nextSectionName: this.sections[currentIndex + 1],
			nextSectionName2: this.sections[currentIndex + 2],
			nextSectionName3: this.sections[currentIndex + 3],
			nextSectionName4: this.sections[currentIndex + 4],
			nextSectionName5: this.sections[currentIndex + 5],
			nextSectionName6: this.sections[currentIndex + 6],
			nextSectionName7: this.sections[currentIndex + 7],
			nextSectionName8: this.sections[currentIndex + 8],
			previousSectionName: this.sections[currentIndex - 1],
			previousSectionName2: this.sections[currentIndex - 2],
			previousSectionName3: this.sections[currentIndex - 3],
			previousSectionName4: this.sections[currentIndex - 4],
			previousSectionName5: this.sections[currentIndex - 5],
			previousSectionName6: this.sections[currentIndex - 6],
			previousSectionName7: this.sections[currentIndex - 7],
			previousSectionName8: this.sections[currentIndex - 8],
		})
	}, 20)

	updateMeasureOrPosition = () => {
		this.setVariableValues({
			currentMeasureOrPosition: this.getVariableValue('currentMeasure') || this.getVariableValue('humanPosition'),
			currentMeasureOrPositionBeats:
				this.getVariableValue('currentMeasureBeats') || this.getVariableValue('humanPositionBeats'),
		})
	}

	initOscListeners(server: Server) {
		//#region global
		server.on('/global/beatsPosition', ([, beats]) => {
			this.setVariableValues({ beatsPosition: Number(beats) })
			this.debouncedCheckFeedbacks(
				Feedback.IsInLoop,
				Feedback.IsInActiveLoop,
				Feedback.SongProgress,
				Feedback.SectionProgress,
				Feedback.SectionProgressByNumber,
			)
		})
		server.on(
			'/global/finePosition',
			throttle(([, beats]) => {
				this.setVariableValues({ finePosition: Number(beats) })
				this.checkFeedbacks(Feedback.SongProgress, Feedback.SectionProgress, Feedback.SectionProgressByNumber)
			}, 40),
		)
		server.on('/global/humanPosition', ([, bars, beats]) => {
			this.setVariableValues({ humanPosition: `${bars ?? 0}.${beats ?? 0}`, humanPositionBeats: Number(beats ?? 0) })
			this.checkFeedbacks(Feedback.IsBeat)
			this.updateMeasureOrPosition()
		})
		server.on('/global/currentMeasure', ([, bars, beats, total]) => {
			if (bars || beats || total) {
				this.setVariableValues({
					currentMeasure: `${bars ?? 0}.${beats ?? 0}`,
					currentMeasureBeats: Number(beats ?? 0),
					currentMeasureTotalBeats: Number(total ?? 0),
				})
			} else {
				this.setVariableValues({
					currentMeasure: undefined,
					currentMeasureBeats: undefined,
					currentMeasureTotalBeats: undefined,
				})
			}

			this.checkFeedbacks(Feedback.IsBeat, Feedback.BeatIsInBar)
			this.updateMeasureOrPosition()
		})
		server.on('/global/tempo', ([, tempo]) => {
			this.setVariableValues({ tempo: Number(tempo) })
		})
		server.on('/global/isPlaying', ([, isPlaying]) => {
			this.setVariableValues({ isPlaying: Boolean(isPlaying) })
			this.debouncedCheckFeedbacks(Feedback.IsPlaying)
		})
		server.on('/global/isRecording', ([, isRecording]) => {
			this.setVariableValues({ isRecording: Boolean(isRecording) })
			this.debouncedCheckFeedbacks(Feedback.IsRecording)
		})
		server.on('/global/timeSignature', ([, numerator, denominator]) => {
			this.setVariableValues({
				timeSignature: `${numerator}/${denominator}`,
				timeSignatureNumerator: Number(numerator),
				timeSignatureDenominator: Number(denominator),
			})
			this.debouncedCheckFeedbacks(Feedback.BeatIsInBar)
		})
		server.on('/global/isSyncingPlayback', ([, isSyncingPlayback]) => {
			this.setVariableValues({ isSyncingPlayback: Boolean(isSyncingPlayback) })
			this.debouncedCheckFeedbacks(Feedback.IsSyncingPlayback)
		})
		//#endregion

		//#region setlist
		server.on('/setlist/name', ([, name]) => {
			this.setVariableValues({ setlistName: String(name) })
		})
		server.on('/setlist/songs', ([, ...songs]) => {
			this.songs = songs as string[]
			this.setVariableValues(
				Object.fromEntries(makeRange(SONG_PRESET_COUNT).map((i) => [`song${i + 1}Name`, String(songs[i] ?? '')])),
			)
			this.debouncedCheckFeedbacks(Feedback.CanJumpToNextSong, Feedback.CanJumpToPreviousSong)
			this.updateSongs()
		})
		server.on('/setlist/sections', ([, ...sections]) => {
			this.sections = sections as string[]
			this.setVariableValues(
				Object.fromEntries(
					makeRange(SECTION_PRESET_COUNT).map((i) => [`section${i + 1}Name`, String(sections[i] ?? '')]),
				),
			)
			this.debouncedCheckFeedbacks(Feedback.CanJumpToNextSection, Feedback.CanJumpToPreviousSection)
			this.updateSections()
		})
		server.on('/setlist/sectionColors', ([, ...colors]) => {
			this.sectionColors = colors.map((c) => COLORS[(c as string) ?? 'black'])
			this.debouncedCheckFeedbacks(Feedback.SectionColor)
		})
		server.on('/setlist/activeSongName', ([, activeSongName]) => {
			this.activeSongName = String(activeSongName ?? '')
			this.updateSongs()
		})
		server.on('/setlist/activeSongIndex', ([, activeSongIndex]) => {
			this.activeSongIndex = Number(activeSongIndex ?? -1)
			this.updateSongs()
			this.debouncedCheckFeedbacks(
				Feedback.IsCurrentSong,
				Feedback.CanJumpToNextSong,
				Feedback.CanJumpToPreviousSong,
				Feedback.IsQueuedNextSong,
			)
		})
		server.on('/setlist/activeSongStart', ([, activeSongStart]) => {
			this.setVariableValues({ activeSongStart: Number(activeSongStart) })
			this.debouncedCheckFeedbacks(Feedback.SongProgress)
		})
		server.on('/setlist/activeSongEnd', ([, activeSongEnd]) => {
			this.setVariableValues({ activeSongEnd: Number(activeSongEnd) })
			this.debouncedCheckFeedbacks(Feedback.SongProgress)
		})
		server.on('/setlist/activeSectionName', ([, activeSectionName]) => {
			this.activeSectionName = String(activeSectionName ?? '')
			this.updateSections()
		})
		server.on('/setlist/activeSectionIndex', ([, activeSectionIndex]) => {
			this.activeSectionIndex = Number(activeSectionIndex ?? -1)
			this.updateSections()
			this.debouncedCheckFeedbacks(
				Feedback.IsCurrentSection,
				Feedback.IsFutureSection,
				Feedback.CanJumpToNextSection,
				Feedback.CanJumpToPreviousSection,
				Feedback.IsQueuedNextSection,
				Feedback.SectionColor,
			)
		})
		server.on('/setlist/activeSectionStart', ([, activeSectionStart]) => {
			this.setVariableValues({ activeSectionStart: Number(activeSectionStart) })
			this.debouncedCheckFeedbacks(Feedback.SectionProgress, Feedback.SectionProgressByNumber)
		})
		server.on('/setlist/activeSectionEnd', ([, activeSectionEnd]) => {
			this.setVariableValues({ activeSectionEnd: Number(activeSectionEnd) })
			this.debouncedCheckFeedbacks(Feedback.SectionProgress, Feedback.SectionProgressByNumber)
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
				Feedback.IsQueuedNextSection,
				Feedback.CanJumpToNextSong,
				Feedback.CanJumpToPreviousSong,
				Feedback.CanJumpToNextSection,
				Feedback.CanJumpToPreviousSection,
			)
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
		server.on('/setlist/remainingTimeInSong', ([, remainingTime]) => {
			this.setVariableValues({ remainingTimeInSong: Number(remainingTime) })
		})
		server.on('/setlist/remainingTimeInSet', ([, remainingTime]) => {
			this.setVariableValues({ remainingTimeInSet: Number(remainingTime) })
		})
		//#endregion

		//#region PlayAUDIO12
		server.on('/playaudio12/isConnected', ([, connected]) => {
			this.setVariableValues({ playAudio12Connected: Boolean(connected) })
			this.debouncedCheckFeedbacks(Feedback.PlayAudio12IsConnected)
		})
		server.on('/playaudio12/scene', ([, scene]) => {
			this.setVariableValues({ playAudio12Scene: Number(scene) })
			this.debouncedCheckFeedbacks(Feedback.PlayAudio12Scene)
		})
		//#endregion

		//#region Timecode
		server.on('/timecode/tc', ([, timecode]) => {
			const tc = String(timecode)
			this.setVariableValues({
				timecode: tc,
				timecodeHours: tc.substring(0, 2),
				timecodeMinutes: tc.substring(3, 5),
				timecodeSeconds: tc.substring(6, 8),
				timecodeFrames: tc.substring(9, 11),
			})
		})
		server.on('/timecode/fps', ([, fps]) => {
			this.setVariableValues({ timecodeFps: String(fps) })
		})
		server.on('/timecode/stale', ([, stale]) => {
			this.setVariableValues({ timecodeStale: Boolean(stale) })
			this.debouncedCheckFeedbacks(Feedback.IsTimecodeActive)
		})
		//#endregion

		//#region settings
		server.on('/settings/autoplay', ([, value]) => {
			this.setVariableValues({ autoplay: Boolean(value) })
			this.debouncedCheckFeedbacks(Feedback.SettingEqualsValue)
		})
		server.on('/settings/safeMode', ([, value]) => {
			this.setVariableValues({ safeMode: Boolean(value) })
			this.debouncedCheckFeedbacks(Feedback.SettingEqualsValue)
		})
		server.on('/settings/alwaysStopOnSongEnd', ([, value]) => {
			this.setVariableValues({ alwaysStopOnSongEnd: Boolean(value) })
			this.debouncedCheckFeedbacks(Feedback.SettingEqualsValue)
		})
		server.on('/settings/autoJumpToNextSong', ([, value]) => {
			this.setVariableValues({ autoJumpToNextSong: Boolean(value) })
			this.debouncedCheckFeedbacks(Feedback.SettingEqualsValue)
		})
		server.on('/settings/autoLoopCurrentSection', ([, value]) => {
			this.setVariableValues({ autoLoopCurrentSection: Boolean(value) })
			this.debouncedCheckFeedbacks(Feedback.SettingEqualsValue)
		})
		server.on('/settings/countIn', ([, value]) => {
			this.setVariableValues({ countIn: Boolean(value) })
			this.debouncedCheckFeedbacks(Feedback.SettingEqualsValue)
		})
		server.on('/settings/countInSoloClick', ([, value]) => {
			this.setVariableValues({ countInSoloClick: Boolean(value) })
			this.debouncedCheckFeedbacks(Feedback.SettingEqualsValue)
		})
		server.on('/settings/countInDuration', ([, value]) => {
			this.setVariableValues({ countInDuration: Number(value) })
			this.debouncedCheckFeedbacks(Feedback.SettingEqualsValue)
		})
		server.on('/settings/jumpMode', ([, value]) => {
			this.setVariableValues({ jumpMode: String(value) })
			this.debouncedCheckFeedbacks(Feedback.SettingEqualsValue)
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
		this.sendOsc(['/unsubscribe'])

		if (this.connectInterval) {
			clearInterval(this.connectInterval)
		}

		this.cancelHeartbeat()
		await Promise.all(this.oscClients.map((c) => new Promise<void>((res) => c.close(res))))
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
				id: 'serverHost',
				type: 'textinput',
				label: 'Server Hosts/IPs',
				default: '127.0.0.1',
				tooltip:
					"Please enter the host(s) you'd like to connect to. If AbleSet is running on the same computer as Companion, leave this as 127.0.0.1. You can provide multiple hosts separated by commas for a redundant setup.",
				width: 12,
			},
			{
				id: 'fineUpdates',
				type: 'checkbox',
				label: 'Fine Updates',
				default: true,
				tooltip:
					'Disable this if it causes performance issues. With this enabled, progress bars are updated every 40ms, otherwise they are updated every beat.',
				width: 12,
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
			[Action.Record]: {
				name: 'Start Recording',
				options: [],
				callback: async () => {
					this.sendOsc(['/global/record'])
				},
			},
			[Action.StopRecord]: {
				name: 'Stop Recording',
				options: [],
				callback: async () => {
					this.sendOsc(['/global/stopRecording'])
				},
			},
			[Action.ToggleRecord]: {
				name: 'Toggle Recording',
				options: [],
				callback: async () => {
					this.sendOsc(['/global/toggleRecording'])
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

			//#region AbleNet
			[Action.SyncPlaybackNow]: {
				name: 'AbleNet: Sync Playback Now',
				options: [],
				callback: async () => this.sendOsc(['/global/syncToRemoteTick']),
			},
			//#endregion

			//#region settings
			[Action.ToggleSetting]: {
				name: 'Toggle Setting',
				options: [
					{
						id: 'setting',
						label: 'Setting',
						type: 'dropdown',
						choices: BOOLEAN_SETTINGS,
						default: 'autoplay',
					},
				],
				callback: async ({ options }) => {
					const setting = this.getVariableValue(String(options.setting)) ?? false
					this.sendOsc([`/settings/${options.setting}`, Number(!setting)])
				},
			},
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
						choices: COUNT_IN_DURATIONS,
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
						choices: JUMP_MODES,
						default: 'quantized',
					},
				],
				callback: async (event) => this.sendOsc(['/settings/jumpMode', String(event.options.value)]),
			},
			//#endregion
		})
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

			[Feedback.IsRecording]: {
				type: 'boolean',
				name: 'Recording',
				defaultStyle: { bgcolor: COLOR_RED_600 },
				callback: () => {
					return Boolean(this.getVariableValue('isRecording'))
				},
				options: [],
			},

			[Feedback.IsBeat]: {
				type: 'boolean',
				name: 'Current Beat Equals',
				defaultStyle: { bgcolor: COLOR_GREEN_500 },
				callback: ({ options }) => {
					const beat = this.getVariableValue('currentMeasureBeats') || this.getVariableValue('humanPositionBeats')
					return beat === Number(options.beat)
				},
				options: [
					{
						id: 'beat',
						label: 'Beat',
						type: 'number',
						min: 1,
						max: 16,
						step: 1,
						default: 1,
						required: true,
					},
				],
			},

			[Feedback.BeatIsInBar]: {
				type: 'boolean',
				name: 'Beat is in Bar',
				defaultStyle: { bgcolor: COLOR_GREEN_500 },
				callback: ({ options }) => {
					return (
						Number(options.beat) <=
						Number(this.getVariableValue('currentMeasureTotalBeats') || this.getVariableValue('timeSignatureNumerator'))
					)
				},
				options: [
					{
						id: 'beat',
						label: 'Beat',
						type: 'number',
						min: 1,
						max: 16,
						step: 1,
						default: 1,
						required: true,
					},
				],
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
					return this.activeSongIndex === Number(feedback.options.songNumber) - 1
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
					return this.activeSectionIndex === Number(feedback.options.sectionNumber) - 1
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

			[Feedback.IsFutureSection]: {
				type: 'boolean',
				name: 'Is Future Section',
				defaultStyle: { color: COLOR_WHITE },
				callback: (feedback) => {
					return this.activeSectionIndex < Number(feedback.options.sectionNumber) - 1
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

			[Feedback.SectionColor]: {
				type: 'advanced',
				name: 'Section Color',
				callback: ({ options }) => {
					const sectionNumber = options.relative
						? this.activeSectionIndex + Number(options.sectionNumber)
						: Number(options.sectionNumber) - 1
					const color = this.sectionColors[sectionNumber]
					const style = {} as Record<string, number>
					;(options.colorProps as string[])?.forEach((prop) => (style[prop] = color))
					return style
				},
				options: [
					{
						id: 'relative',
						label: 'Relative',
						type: 'checkbox',
						default: false,
					},
					{
						id: 'sectionNumber',
						label: 'Section Number',
						type: 'number',
						min: -100,
						max: 100,
						default: 1,
					},
					{
						id: 'colorProps',
						label: 'Color Background and/or Text',
						type: 'multidropdown',
						default: ['bgcolor'],
						choices: [
							{ id: 'bgcolor', label: 'Background' },
							{ id: 'color', label: 'Text' },
						],
					},
				],
			},

			[Feedback.SongProgress]: {
				type: 'advanced',
				name: 'Song Progress',
				callback: ({ options }) => {
					const activeSongStart = Number(this.getVariableValue('activeSongStart') ?? 0)
					const activeSongEnd = Number(this.getVariableValue('activeSongEnd') ?? 0)
					const position = Number(this.getVariableValue('finePosition') || this.getVariableValue('beatsPosition') || 0)
					const totalPercent = (position - activeSongStart) / (activeSongEnd - activeSongStart)

					const buttonCount = Number(options.buttonCount)
					const buttonIndex = Number(options.buttonNumber) - 1
					const buttonStart = buttonIndex / buttonCount
					const buttonEnd = (buttonIndex + 1) / buttonCount
					const percent = (totalPercent - buttonStart) / (buttonEnd - buttonStart)

					const style =
						buttonCount > 1 && options.style === 'slim'
							? buttonIndex === 0
								? ('slimLeft' as const)
								: buttonIndex === buttonCount - 1
									? ('slimRight' as const)
									: ('slimMid' as const)
							: options.style === 'fullTransparent'
								? ('fullTransparent' as const)
								: ('full' as const)

					return { png64: getProgressIcon(percent, style) }
				},
				options: [
					{
						id: 'buttonCount',
						label: 'Button Count',
						tooltip: 'The total number of buttons for the progress bar',
						type: 'number',
						min: 0,
						max: 32,
						default: 4,
					},
					{
						id: 'buttonNumber',
						label: 'Button Number',
						tooltip: 'The number of the button in the progress bar',
						type: 'number',
						min: 0,
						max: 32,
						default: 4,
					},
					{
						id: 'style',
						label: 'Style',
						type: 'dropdown',
						choices: [
							{ id: 'full', label: 'Full Black' },
							{ id: 'fullTransparent', label: 'Full Transparent' },
							{ id: 'slim', label: 'Slim' },
						],
						default: 'full',
					},
				],
			},

			[Feedback.SectionProgressByNumber]: {
				type: 'advanced',
				name: 'Section Progress Background By Section Number',
				callback: ({ options }) => {
					let totalPercent
					const relativeSectionIndex = options.relative
						? Number(options.sectionNumber)
						: Number(options.sectionNumber) - this.activeSectionIndex - 1
					if (relativeSectionIndex > 0) {
						totalPercent = 0
					} else if (relativeSectionIndex < 0) {
						totalPercent = 100
					} else {
						const activeSectionStart = Number(this.getVariableValue('activeSectionStart') ?? 0)
						const activeSectionEnd = Number(this.getVariableValue('activeSectionEnd') ?? 0)
						const beatsPosition = Number(this.getVariableValue('beatsPosition') ?? 0)
						totalPercent = (beatsPosition - activeSectionStart) / (activeSectionEnd - activeSectionStart)
					}

					const absoluteSectionIndex = options.relative
						? this.activeSectionIndex + Number(options.sectionNumber)
						: Number(options.sectionNumber) - 1
					const style =
						Number(this.sections.length) > 1 && options.style === 'slim'
							? absoluteSectionIndex === 0
								? ('slimLeft' as const)
								: absoluteSectionIndex === Number(this.sections.length) - 1
									? ('slimRight' as const)
									: ('slimMid' as const)
							: options.style === 'fullTransparent'
								? ('fullTransparent' as const)
								: ('full' as const)

					return { png64: getProgressIcon(totalPercent, style) }
				},
				options: [
					{
						id: 'relative',
						label: 'Relative',
						type: 'checkbox',
						default: false,
					},
					{
						id: 'sectionNumber',
						label: 'Section Number',
						type: 'number',
						min: -100,
						max: 100,
						default: 1,
					},
					{
						id: 'style',
						label: 'Style',
						type: 'dropdown',
						choices: [
							{ id: 'full', label: 'Full Black' },
							{ id: 'fullTransparent', label: 'Full Transparent' },
							{ id: 'slim', label: 'Slim' },
						],
						default: 'full',
					},
				],
			},

			[Feedback.SectionProgress]: {
				type: 'advanced',
				name: 'Section Progress Background',
				callback: ({ options }) => {
					const activeSongStart = Number(this.getVariableValue('activeSectionStart') ?? 0)
					const activeSongEnd = Number(this.getVariableValue('activeSectionEnd') ?? 0)
					const position = Number(this.getVariableValue('finePosition') || this.getVariableValue('beatsPosition') || 0)
					const totalPercent = (position - activeSongStart) / (activeSongEnd - activeSongStart)

					const buttonCount = Number(options.buttonCount)
					const buttonIndex = Number(options.buttonNumber) - 1
					const buttonStart = buttonIndex / buttonCount
					const buttonEnd = (buttonIndex + 1) / buttonCount
					const percent = (totalPercent - buttonStart) / (buttonEnd - buttonStart)

					const style =
						buttonCount > 1 && options.style === 'slim'
							? buttonIndex === 0
								? ('slimLeft' as const)
								: buttonIndex === buttonCount - 1
									? ('slimRight' as const)
									: ('slimMid' as const)
							: options.style === 'fullTransparent'
								? ('fullTransparent' as const)
								: ('full' as const)

					return { png64: getProgressIcon(percent, style) }
				},
				options: [
					{
						id: 'buttonCount',
						label: 'Button Count',
						tooltip: 'The total number of buttons for the progress bar',
						type: 'number',
						min: 0,
						max: 32,
						default: 4,
					},
					{
						id: 'buttonNumber',
						label: 'Button Number',
						tooltip: 'The number of the button in the progress bar',
						type: 'number',
						min: 0,
						max: 32,
						default: 1,
					},
					{
						id: 'style',
						label: 'Style',
						type: 'dropdown',
						choices: [
							{ id: 'full', label: 'Full Black' },
							{ id: 'fullTransparent', label: 'Full Transparent' },
							{ id: 'slim', label: 'Slim' },
						],
						default: 'full',
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
				name: 'Is Queued Song Relative to Current',
				defaultStyle: { bgcolor: COLOR_GREEN_500 },
				callback: (feedback) => {
					const queuedSongIndex = Number(this.getVariableValue('queuedSongIndex') ?? -1)
					const activeSongIndex = Number(this.getVariableValue('activeSongIndex') ?? -1)

					if (queuedSongIndex === -1) {
						return false
					} else if (feedback.options.songDelta === 'anyNext') {
						return queuedSongIndex > activeSongIndex
					} else if (feedback.options.songDelta === 'anyPrevious') {
						return queuedSongIndex < activeSongIndex
					} else {
						const songIndex = activeSongIndex + Number(feedback.options.songDelta)
						return queuedSongIndex !== -1 && queuedSongIndex === songIndex
					}
				},
				options: [
					{
						id: 'songDelta',
						label: 'Song Delta',
						tooltip: 'e.g. 1 for the next song, -1 for the previous song',
						type: 'dropdown',
						allowCustom: true,
						choices: [
							{ id: 'anyNext', label: 'Any Next Song' },
							{ id: 'anyPrevious', label: 'Any Previous Song' },
						],
						default: 1,
						regex: '^-?\\d+$',
					},
				],
			},

			[Feedback.IsQueuedNextSection]: {
				type: 'boolean',
				name: 'Is Queued Section Relative to Current',
				defaultStyle: { bgcolor: COLOR_GREEN_500 },
				callback: (feedback) => {
					const queuedSectionIndex = Number(this.getVariableValue('queuedSectionIndex') ?? -1)
					const activeSectionIndex = Number(this.getVariableValue('activeSectionIndex') ?? -1)

					if (queuedSectionIndex === -1) {
						return false
					} else if (feedback.options.sectionDelta === 'anyNext') {
						return queuedSectionIndex > activeSectionIndex
					} else if (feedback.options.sectionDelta === 'anyPrevious') {
						return queuedSectionIndex < activeSectionIndex
					} else {
						const songIndex = activeSectionIndex + Number(feedback.options.sectionDelta)
						return queuedSectionIndex !== -1 && queuedSectionIndex === songIndex
					}
				},
				options: [
					{
						id: 'sectionDelta',
						label: 'Song Delta',
						tooltip: 'e.g. 1 for the next section, -1 for the previous section',
						type: 'dropdown',
						allowCustom: true,
						choices: [
							{ id: 'anyNext', label: 'Any Next Section' },
							{ id: 'anyPrevious', label: 'Any Previous Section' },
						],
						default: 1,
						regex: '^-?\\d+$',
					},
				],
			},

			[Feedback.CanJumpToNextSong]: {
				type: 'boolean',
				name: 'Can Jump to Next Song',
				defaultStyle: { color: COLOR_WHITE },
				callback: () => {
					const activeSongIndex = Number(this.getVariableValue('activeSongIndex') ?? -1)
					const queuedSongIndex = Number(this.getVariableValue('queuedSongIndex') ?? -1)
					const relevantSongIndex = queuedSongIndex !== -1 ? queuedSongIndex : activeSongIndex
					return relevantSongIndex < this.songs.length - 1
				},
				options: [],
			},

			[Feedback.CanJumpToPreviousSong]: {
				type: 'boolean',
				name: 'Can Jump to Previous Song',
				defaultStyle: { color: COLOR_WHITE },
				callback: () => {
					const activeSongIndex = Number(this.getVariableValue('activeSongIndex') ?? -1)
					const queuedSongIndex = Number(this.getVariableValue('queuedSongIndex') ?? -1)
					const relevantSongIndex = queuedSongIndex !== -1 ? queuedSongIndex : activeSongIndex
					return relevantSongIndex > 0
				},
				options: [],
			},

			[Feedback.CanJumpToNextSection]: {
				type: 'boolean',
				name: 'Can Jump to Next Section',
				defaultStyle: { color: COLOR_WHITE },
				callback: () => {
					const activeSectionIndex = Number(this.getVariableValue('activeSectionIndex') ?? -1)
					const queuedSectionIndex = Number(this.getVariableValue('queuedSectionIndex') ?? -1)
					const relevantSectionIndex = queuedSectionIndex !== -1 ? queuedSectionIndex : activeSectionIndex
					return relevantSectionIndex < this.sections.length - 1
				},
				options: [],
			},

			[Feedback.CanJumpToPreviousSection]: {
				type: 'boolean',
				name: 'Can Jump to Previous Section',
				defaultStyle: { color: COLOR_WHITE },
				callback: () => {
					const activeSectionIndex = Number(this.getVariableValue('activeSectionIndex') ?? -1)
					const queuedSectionIndex = Number(this.getVariableValue('queuedSectionIndex') ?? -1)
					const relevantSectionIndex = queuedSectionIndex !== -1 ? queuedSectionIndex : activeSectionIndex
					return relevantSectionIndex > 0
				},
				options: [],
			},

			[Feedback.SettingEqualsValue]: {
				type: 'boolean',
				name: 'Setting Equals Value',
				defaultStyle: { bgcolor: COLOR_GREEN_500 },
				callback: ({ options }) => {
					const value = String(this.getVariableValue(String(options.setting)))
					return value === String(options.value)
				},
				options: [
					{
						id: 'setting',
						label: 'Setting',
						type: 'dropdown',
						choices: [
							{ id: 'autoplay', label: 'Autoplay' },
							{ id: 'safeMode', label: 'Safe Mode' },
							{ id: 'alwaysStopOnSongEnd', label: 'Always Stop on Song End' },
							{ id: 'autoJumpToNextSong', label: 'Autojump to the Next Song' },
							{ id: 'autoLoopCurrentSection', label: 'Autoloop the Current Section' },
							{ id: 'countIn', label: 'Count-In' },
							{ id: 'countInSoloClick', label: 'Solo Click During Count-In' },
							{ id: 'countInDuration', label: 'Count-In Duration' },
							{ id: 'jumpMode', label: 'Jump Mode' },
						],
						default: 'autoplay',
					},
					{ id: 'value', label: 'Value', type: 'textinput', default: 'true', required: true },
				],
			},

			[Feedback.PlayAudio12IsConnected]: {
				type: 'boolean',
				name: 'PlayAUDIO12 Connected',
				defaultStyle: { color: COLOR_WHITE },
				callback: () => {
					return this.getVariableValue('playAudio12Connected') === true
				},
				options: [],
			},

			[Feedback.PlayAudio12Scene]: {
				type: 'boolean',
				name: 'PlayAUDIO12 Scene Equals Value',
				defaultStyle: { bgcolor: COLOR_GREEN_800 },
				callback: ({ options }) => {
					return this.getVariableValue('playAudio12Scene') === options.scene
				},
				options: [
					{
						id: 'scene',
						label: 'Scene',
						type: 'dropdown',
						choices: [
							{ id: 1, label: 'Scene A' },
							{ id: 2, label: 'Scene B' },
						],
						default: 1,
					},
				],
			},

			[Feedback.IsTimecodeActive]: {
				type: 'boolean',
				name: 'Timecode is Active',
				defaultStyle: { color: COLOR_WHITE },
				callback: () => {
					const stale = this.getVariableValue('timecodeStale')
					return typeof stale !== 'undefined' && !stale
				},
				options: [
					{
						id: 'scene',
						label: 'Scene',
						type: 'dropdown',
						choices: [
							{ id: 1, label: 'Scene A' },
							{ id: 2, label: 'Scene B' },
						],
						default: 1,
					},
				],
			},
		})
	}

	updateVariableDefinitions() {
		this.setVariableDefinitions(variables)
	}

	updatePresets() {
		this.setPresetDefinitions(presets)
	}
}

runEntrypoint(ModuleInstance, [])
