import { CompanionButtonPresetDefinition, CompanionPresetDefinitions } from '@companion-module/base'
import { Action, Feedback } from './enums'
import {
	COLOR_BLACK,
	COLOR_WHITE,
	COLOR_GREEN_800,
	COLOR_GREEN_500,
	COLOR_GREEN_700,
	COLOR_GRAY,
	COLOR_DARK_GRAY,
	COLOR_RED_700,
} from './utils/colors'
import { makeRange } from './utils/range'
import { BOOLEAN_SETTINGS, COUNT_IN_DURATIONS, JUMP_MODES, SECTION_PRESET_COUNT, SONG_PRESET_COUNT } from './constants'
import {
	PLAY_ICON,
	PLAY_ICON_GRAY,
	PAUSE_ICON_GREEN,
	STOP_ICON_GREEN,
	LOOP_ICON_GRAY,
	LOOP_ICON,
	LOOP_ICON_GREEN,
	PROGRESS_0,
	PROGRESS_1,
	PROGRESS_2,
	PROGRESS_3,
	PROGRESS_4,
	PROGRESS_5,
	PROGRESS_6,
	PROGRESS_7,
	PROGRESS_8,
} from './icons'

const defaultSongStyle = { bgcolor: COLOR_BLACK, color: COLOR_WHITE, size: '14' } as const
const defaultStyle = { bgcolor: COLOR_BLACK, color: COLOR_WHITE, size: '18' } as const

const songPresets = Object.fromEntries(
	makeRange(SONG_PRESET_COUNT).map((i) => [
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
	]),
)

const sectionPresets = Object.fromEntries(
	makeRange(SECTION_PRESET_COUNT).map((i) => [
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
	]),
)

const nextPrevSongs: CompanionPresetDefinitions = {
	currentSong: {
		category: 'Jump Songs',
		name: 'Current Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, bgcolor: COLOR_GREEN_500, text: `Current Song` },
		style: { ...defaultSongStyle, bgcolor: COLOR_GREEN_500, text: `$(AbleSet:activeSongName)` },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 0, force: 'true' } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: 0 }, style: { bgcolor: COLOR_GREEN_800 } },
		],
	},
	nextSong1: {
		category: 'Jump Songs',
		name: 'Next Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `Next Song` },
		style: { ...defaultSongStyle, text: `$(AbleSet:nextSongName)` },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 1, force: 'true' } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: 1 }, style: { bgcolor: COLOR_GREEN_800 } },
		],
	},
	nextSong2: {
		category: 'Jump Songs',
		name: '2nd Next Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `2nd Next Song` },
		style: { ...defaultSongStyle, text: `$(AbleSet:nextSongName2)` },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 2, force: 'true' } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: 2 }, style: { bgcolor: COLOR_GREEN_800 } },
		],
	},
	nextSong3: {
		category: 'Jump Songs',
		name: '3rd Next Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `3rd Next Song` },
		style: { ...defaultSongStyle, text: `$(AbleSet:nextSongName3)` },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 3, force: 'true' } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: 3 }, style: { bgcolor: COLOR_GREEN_800 } },
		],
	},
	nextSong4: {
		category: 'Jump Songs',
		name: '4th Next Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `4th Next Song` },
		style: { ...defaultSongStyle, text: `$(AbleSet:nextSongName4)` },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 4, force: 'true' } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: 4 }, style: { bgcolor: COLOR_GREEN_800 } },
		],
	},
	previousSong1: {
		category: 'Jump Songs',
		name: 'Previous Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `Prev Song` },
		style: { ...defaultSongStyle, text: `$(AbleSet:previousSongName)` },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: -1, force: 'true' } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: -1 }, style: { bgcolor: COLOR_GREEN_800 } },
		],
	},
	previousSong2: {
		category: 'Jump Songs',
		name: '2nd Previous Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `2nd Prev Song` },
		style: { ...defaultSongStyle, text: `$(AbleSet:previousSongName2)` },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: -2, force: 'true' } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: -2 }, style: { bgcolor: COLOR_GREEN_800 } },
		],
	},
	previousSong3: {
		category: 'Jump Songs',
		name: '3rd Previous Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `3rd Prev Song` },
		style: { ...defaultSongStyle, text: `$(AbleSet:previousSongName3)` },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: -3, force: 'true' } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: -3 }, style: { bgcolor: COLOR_GREEN_800 } },
		],
	},
	previousSong4: {
		category: 'Jump Songs',
		name: '4th Previous Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `4th Prev Song` },
		style: { ...defaultSongStyle, text: `$(AbleSet:previousSongName4)` },
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
		previewStyle: { ...defaultSongStyle, bgcolor: COLOR_GREEN_500, text: `Current Section` },
		style: { ...defaultSongStyle, bgcolor: COLOR_GREEN_500, text: `$(AbleSet:activeSectionName)` },
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
		previewStyle: { ...defaultSongStyle, text: `Next Section` },
		style: { ...defaultSongStyle, text: `$(AbleSet:nextSectionName)` },
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
		previewStyle: { ...defaultSongStyle, text: `2nd Next Section` },
		style: { ...defaultSongStyle, text: `$(AbleSet:nextSectionName2)` },
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
		previewStyle: { ...defaultSongStyle, text: `3rd Next Section` },
		style: { ...defaultSongStyle, text: `$(AbleSet:nextSectionName3)` },
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
		previewStyle: { ...defaultSongStyle, text: `4th Next Section` },
		style: { ...defaultSongStyle, text: `$(AbleSet:nextSectionName4)` },
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
		previewStyle: { ...defaultSongStyle, text: `Prev Section` },
		style: { ...defaultSongStyle, text: `$(AbleSet:previousSectionName)` },
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
		previewStyle: { ...defaultSongStyle, text: `2nd Prev Section` },
		style: { ...defaultSongStyle, text: `$(AbleSet:previousSectionName2)` },
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
		previewStyle: { ...defaultSongStyle, text: `3rd Prev Section` },
		style: { ...defaultSongStyle, text: `$(AbleSet:previousSectionName3)` },
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
		previewStyle: { ...defaultSongStyle, text: `4th Prev Section` },
		style: { ...defaultSongStyle, text: `$(AbleSet:previousSectionName4)` },
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
		previewStyle: { ...defaultStyle, text: 'Play Pause', png64: PLAY_ICON_GRAY },
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
		previewStyle: { ...defaultStyle, text: 'Play Stop', png64: PLAY_ICON_GRAY },
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
		feedbacks: [
			{ feedbackId: Feedback.CanJumpToPreviousSong, options: {}, style: { color: COLOR_WHITE } },
			{
				feedbackId: Feedback.IsQueuedNextSong,
				options: { songDelta: 'anyPrevious' },
				style: { bgcolor: COLOR_GREEN_800 },
			},
		],
	},
	nextSong: {
		category: 'Playback',
		name: 'Next Song',
		type: 'button',
		style: { ...defaultStyle, color: COLOR_GRAY, text: '>\nSong' },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 1 } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.CanJumpToNextSong, options: {}, style: { color: COLOR_WHITE } },
			{
				feedbackId: Feedback.IsQueuedNextSong,
				options: { songDelta: 'anyNext' },
				style: { bgcolor: COLOR_GREEN_800 },
			},
		],
	},
	prevSection: {
		category: 'Playback',
		name: 'Previous Section',
		type: 'button',
		style: { ...defaultStyle, color: COLOR_GRAY, text: '<\nSection' },
		steps: [{ down: [{ actionId: Action.JumpBySections, options: { steps: -1 } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.CanJumpToPreviousSection, options: {}, style: { color: COLOR_WHITE } },
			{
				feedbackId: Feedback.IsQueuedNextSection,
				options: { sectionDelta: 'anyPrevious' },
				style: { bgcolor: COLOR_GREEN_800 },
			},
		],
	},
	nextSection: {
		category: 'Playback',
		name: 'Next Section',
		type: 'button',
		style: { ...defaultStyle, color: COLOR_GRAY, text: '>\nSection' },
		steps: [{ down: [{ actionId: Action.JumpBySections, options: { steps: 1 } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.CanJumpToNextSection, options: {}, style: { color: COLOR_WHITE } },
			{
				feedbackId: Feedback.IsQueuedNextSection,
				options: { sectionDelta: 'anyNext' },
				style: { bgcolor: COLOR_GREEN_800 },
			},
		],
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
	playbackPosition: {
		category: 'Playback',
		name: 'Playback Position',
		type: 'button',
		style: { ...defaultStyle, text: '$(AbleSet:humanPosition)' },
		steps: [],
		feedbacks: [],
	},
	playbackPositionBeats: {
		category: 'Playback',
		name: 'Current Beat',
		type: 'button',
		style: { ...defaultStyle, size: 'auto', text: '$(AbleSet:humanPositionBeats)' },
		previewStyle: { ...defaultSongStyle, text: 'Beat\n1/2/3/4' },
		steps: [],
		feedbacks: [],
	},
	timeSignature: {
		category: 'Playback',
		name: 'Time Signature',
		type: 'button',
		style: { ...defaultStyle, text: '$(AbleSet:timeSignature)' },
		steps: [],
		feedbacks: [],
	},
}

const beatPresets = Object.fromEntries(
	makeRange(8).map((i) => [
		`beat${i + 1}`,
		{
			category: 'Visual Metronome',
			name: `Beat ${i + 1}`,
			type: 'button',
			style: { ...defaultStyle, size: 'auto', color: COLOR_DARK_GRAY, text: `${i + 1}` },
			previewStyle: { ...defaultStyle, size: 'auto', text: `${i + 1}` },
			steps: [],
			feedbacks: [
				{ feedbackId: Feedback.BeatIsInBar, options: { beat: i + 1 }, style: { color: COLOR_WHITE } },
				{ feedbackId: Feedback.IsBeat, options: { beat: i + 1 }, style: { bgcolor: COLOR_GREEN_500 } },
			],
		} as CompanionButtonPresetDefinition,
	]),
)

const booleanSettingsPresets = Object.fromEntries(
	BOOLEAN_SETTINGS.map((s) => [
		s.id,
		{
			category: 'Settings',
			name: s.label,
			type: 'button',
			style: { ...defaultSongStyle, text: s.label },
			steps: [{ down: [{ actionId: Action.ToggleSetting, options: { setting: s.id } }], up: [] }],
			feedbacks: [
				{
					feedbackId: Feedback.SettingEqualsValue,
					options: { setting: s.id, value: 'true' },
					style: { bgcolor: COLOR_GREEN_500 },
				},
			],
		} as CompanionButtonPresetDefinition,
	]),
)

const countInDurationSettingsPresets = Object.fromEntries(
	COUNT_IN_DURATIONS.map((s) => [
		s.id,
		{
			category: 'Settings',
			name: `Count-In Duration / ${s.label}`,
			type: 'button',
			style: { ...defaultSongStyle, text: s.label },
			previewStyle: { ...defaultSongStyle, text: `Count-In\n${s.label}` },
			steps: [{ down: [{ actionId: Action.SetCountInDuration, options: { value: s.id } }], up: [] }],
			feedbacks: [
				{
					feedbackId: Feedback.SettingEqualsValue,
					options: { setting: 'countInDuration', value: s.id },
					style: { bgcolor: COLOR_GREEN_500 },
				},
			],
		} as CompanionButtonPresetDefinition,
	]),
)

const jumpModeSettingsPresets = Object.fromEntries(
	JUMP_MODES.map((s) => [
		s.id,
		{
			category: 'Settings',
			name: `Jump Mode / ${s.label}`,
			type: 'button',
			style: { ...defaultSongStyle, text: s.label },
			previewStyle: { ...defaultSongStyle, text: `Jump:\n${s.label}` },
			steps: [{ down: [{ actionId: Action.SetJumpMode, options: { value: s.id } }], up: [] }],
			feedbacks: [
				{
					feedbackId: Feedback.SettingEqualsValue,
					options: { setting: 'jumpMode', value: s.id },
					style: { bgcolor: COLOR_GREEN_500 },
				},
			],
		} as CompanionButtonPresetDefinition,
	]),
)

const playAudio12Presets: CompanionPresetDefinitions = {
	playAudio12: {
		category: 'PlayAUDIO12',
		name: 'PlayAUDIO12 Scene',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `PA12` },
		style: { ...defaultSongStyle, color: COLOR_GRAY, text: `PA12\nN/A` },
		steps: [{ down: [{ actionId: Action.Pa12ToggleScene, options: {} }], up: [] }],
		feedbacks: [
			{
				feedbackId: Feedback.PlayAudio12IsConnected,
				options: {},
				style: { color: COLOR_WHITE, text: `PA12\nN/A` },
			},
			{
				feedbackId: Feedback.PlayAudio12Scene,
				options: { scene: 1 },
				style: { bgcolor: COLOR_GREEN_800, text: `PA12\nScene A` },
			},
			{
				feedbackId: Feedback.PlayAudio12Scene,
				options: { scene: 2 },
				style: { bgcolor: COLOR_RED_700, text: `PA12\nScene B` },
			},
		],
	},
}

const timecodePresets: CompanionPresetDefinitions = {
	timecodeHours: {
		category: 'LTC Timecode',
		name: 'Timecode Hours',
		type: 'button',
		previewStyle: { ...defaultStyle, size: '30', text: `HH` },
		style: { ...defaultStyle, color: COLOR_GRAY, size: '44', text: `$(AbleSet:timecodeHours)` },
		feedbacks: [{ feedbackId: Feedback.IsTimecodeActive, options: {}, style: { color: COLOR_WHITE } }],
		steps: [],
	},
	timecodeMinutes: {
		category: 'LTC Timecode',
		name: 'Timecode Minutes',
		type: 'button',
		previewStyle: { ...defaultStyle, size: '30', text: `MM` },
		style: { ...defaultStyle, color: COLOR_GRAY, size: '44', text: `$(AbleSet:timecodeMinutes)` },
		feedbacks: [{ feedbackId: Feedback.IsTimecodeActive, options: {}, style: { color: COLOR_WHITE } }],
		steps: [],
	},
	timecodeSeconds: {
		category: 'LTC Timecode',
		name: 'Timecode Seconds',
		type: 'button',
		previewStyle: { ...defaultStyle, size: '30', text: `SS` },
		style: { ...defaultStyle, color: COLOR_GRAY, size: '44', text: `$(AbleSet:timecodeSeconds)` },
		feedbacks: [{ feedbackId: Feedback.IsTimecodeActive, options: {}, style: { color: COLOR_WHITE } }],
		steps: [],
	},
	timecodeFrames: {
		category: 'LTC Timecode',
		name: 'Timecode Frames',
		type: 'button',
		previewStyle: { ...defaultStyle, size: '30', text: `FF` },
		style: { ...defaultStyle, color: COLOR_GRAY, size: '44', text: `$(AbleSet:timecodeFrames)` },
		feedbacks: [{ feedbackId: Feedback.IsTimecodeActive, options: {}, style: { color: COLOR_WHITE } }],
		steps: [],
	},
	timecode: {
		category: 'LTC Timecode',
		name: 'Timecode',
		type: 'button',
		previewStyle: { ...defaultStyle, size: '18', text: 'HH:MM:SS:FF' },
		style: { ...defaultStyle, color: COLOR_GRAY, size: '24', text: `$(AbleSet:timecode)` },
		feedbacks: [{ feedbackId: Feedback.IsTimecodeActive, options: {}, style: { color: COLOR_WHITE } }],
		steps: [],
	},
	timecodeMinutesSeconds: {
		category: 'LTC Timecode',
		name: 'Timecode Minutes and Seconds',
		type: 'button',
		previewStyle: { ...defaultStyle, size: '18', text: 'MM:SS' },
		style: {
			...defaultStyle,
			color: COLOR_GRAY,
			size: '24',
			text: `$(AbleSet:timecodeMinutes):$(AbleSet:timecodeSeconds)`,
		},
		feedbacks: [{ feedbackId: Feedback.IsTimecodeActive, options: {}, style: { color: COLOR_WHITE } }],
		steps: [],
	},
	timecodeFps: {
		category: 'LTC Timecode',
		name: 'Timecode FPS',
		type: 'button',
		previewStyle: { ...defaultStyle, size: '24', text: `30 FPS` },
		style: { ...defaultStyle, color: COLOR_GRAY, size: '24', text: `$(AbleSet:timecodeFps) FPS` },
		feedbacks: [{ feedbackId: Feedback.IsTimecodeActive, options: {}, style: { color: COLOR_WHITE } }],
		steps: [],
	},
}

const makeProgressPresets = (
	buttonCount: number,
	feedbackId: Feedback.SongProgress | Feedback.SectionProgress,
): CompanionPresetDefinitions => {
	const category = feedbackId === Feedback.SongProgress ? 'Song Progress' : 'Section Progress'

	return Object.fromEntries(
		makeRange(buttonCount).map((i) => {
			const buttonNumber = i + 1
			const buttonText = `${buttonNumber}/${buttonCount}`
			const percent = 100 * ((buttonNumber - 1) / buttonCount)
			const step = 100 / 8 / buttonCount

			return [
				`${feedbackId}${buttonNumber}${buttonCount}`,
				{
					category,
					name: `${category} (${buttonText})`,
					type: 'button',
					previewStyle: { ...defaultStyle, size: '30', bgcolor: COLOR_GREEN_800, text: `${buttonText}` },
					style: { ...defaultStyle, bgcolor: COLOR_GREEN_800, png64: PROGRESS_0, text: '' },
					feedbacks: [
						{ feedbackId: Feedback.IsPlaying, options: {}, style: { bgcolor: COLOR_GREEN_700 } },
						{ feedbackId, options: { minPercent: percent + step * 1 }, style: { png64: PROGRESS_1 } },
						{ feedbackId, options: { minPercent: percent + step * 2 }, style: { png64: PROGRESS_2 } },
						{ feedbackId, options: { minPercent: percent + step * 3 }, style: { png64: PROGRESS_3 } },
						{ feedbackId, options: { minPercent: percent + step * 4 }, style: { png64: PROGRESS_4 } },
						{ feedbackId, options: { minPercent: percent + step * 5 }, style: { png64: PROGRESS_5 } },
						{ feedbackId, options: { minPercent: percent + step * 6 }, style: { png64: PROGRESS_6 } },
						{ feedbackId, options: { minPercent: percent + step * 7 }, style: { png64: PROGRESS_7 } },
						{ feedbackId, options: { minPercent: percent + step * 8 }, style: { png64: PROGRESS_8 } },
					],
					steps: [],
				} satisfies CompanionButtonPresetDefinition,
			]
		}),
	)
}

const progressPresets = {
	...makeProgressPresets(1, Feedback.SongProgress),
	...makeProgressPresets(2, Feedback.SongProgress),
	...makeProgressPresets(4, Feedback.SongProgress),
	...makeProgressPresets(8, Feedback.SongProgress),
	...makeProgressPresets(1, Feedback.SectionProgress),
	...makeProgressPresets(2, Feedback.SectionProgress),
	...makeProgressPresets(4, Feedback.SectionProgress),
	...makeProgressPresets(8, Feedback.SectionProgress),
}

export const presets: CompanionPresetDefinitions = {
	...songPresets,
	...sectionPresets,
	...nextPrevSongs,
	...nextPrevSections,
	...playbackPresets,
	...progressPresets,
	...playAudio12Presets,
	...timecodePresets,
	...beatPresets,
	...booleanSettingsPresets,
	...countInDurationSettingsPresets,
	...jumpModeSettingsPresets,
}
