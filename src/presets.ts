import type {
	CompanionButtonStyleProps,
	CompanionPresetDefinitions,
	CompanionPresetSection,
} from '@companion-module/base'
import {
	BOOLEAN_SETTINGS,
	COUNT_IN_DURATIONS,
	JUMP_MODES,
	RELATIVE_SECTION_PRESETS_COUNT,
	RELATIVE_SONG_PRESETS_COUNT,
	SECTION_PRESET_COUNT,
	SONG_PRESET_COUNT,
} from './constants.js'
import { Action, Feedback } from './enums.js'
import {
	LOOP_ICON,
	LOOP_ICON_GRAY,
	LOOP_ICON_GREEN,
	NEXT_BAR_ICON,
	NEXT_BAR_ICON_GRAY,
	NEXT_SONG_ICON,
	NEXT_SONG_ICON_GRAY,
	PAUSE_ICON_GREEN,
	PLAY_ICON,
	PLAY_ICON_GRAY,
	PREV_BAR_ICON,
	PREV_BAR_ICON_GRAY,
	PREV_SONG_ICON,
	PREV_SONG_ICON_GRAY,
	PROGRESS,
	QUEUED_ICON,
	RECORD_ICON,
	RECORD_ICON_GRAY,
	RECORD_ICON_RED,
	STOP_ICON_GREEN,
} from './icons.js'
import {
	COLOR_BLACK,
	COLOR_DARK_GRAY,
	COLOR_GRAY,
	COLOR_GREEN_500,
	COLOR_GREEN_700,
	COLOR_GREEN_800,
	COLOR_RED_600,
	COLOR_RED_700,
	COLOR_WHITE,
} from './utils/colors.js'
import { makeRange } from './utils/range.js'

const defaultSongStyle: Omit<CompanionButtonStyleProps, 'text'> = {
	bgcolor: COLOR_BLACK,
	color: COLOR_WHITE,
	size: '14',
} as const

const defaultStyle: Omit<CompanionButtonStyleProps, 'text'> = {
	bgcolor: COLOR_BLACK,
	color: COLOR_WHITE,
	size: '18',
} as const

/** Generates a name for relative song/section presets */
const makeOrdinal = (i: number, suffix: string) => {
	if (i === 0) {
		return suffix
	} else if (i === 1) {
		return `2nd ${suffix}`
	} else if (i === 2) {
		return `3rd ${suffix}`
	} else {
		return `${i + 1}th ${suffix}`
	}
}

const songPresets: CompanionPresetDefinitions = Object.fromEntries(
	makeRange(SONG_PRESET_COUNT).map((i) => [
		`song${i + 1}`,
		{
			name: `Song ${i + 1}`,
			type: 'simple',
			previewStyle: { ...defaultSongStyle, text: `Song ${i + 1}` },
			style: { ...defaultSongStyle, text: `$(AbleSet:song${i + 1}Name)` },
			steps: [
				{
					down: [{ actionId: Action.JumpToSongByNumber, options: { number: i + 1 } }],
					up: [],
				},
			],
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
		},
	]),
)

const sectionPresets: CompanionPresetDefinitions = Object.fromEntries(
	makeRange(SECTION_PRESET_COUNT).map((i) => [
		`section${i + 1}`,
		{
			name: `Section ${i + 1}`,
			type: 'simple',
			previewStyle: { ...defaultSongStyle, text: `Section ${i + 1}` },
			style: { ...defaultSongStyle, text: `$(AbleSet:section${i + 1}Name)` },
			steps: [
				{
					down: [
						{
							actionId: Action.JumpToSectionByNumber,
							options: { number: i + 1 },
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: Feedback.SectionColor,
					options: { sectionNumber: i + 1, colorProps: ['bgcolor'] },
				},
				{
					feedbackId: Feedback.SectionProgressByNumber,
					options: { sectionNumber: i + 1, style: 'fullTransparent' },
				},
				{
					feedbackId: Feedback.IsQueuedSection,
					options: { sectionNumber: i + 1 },
					style: { png64: QUEUED_ICON, color: COLOR_WHITE },
				},
				// {
				// 	feedbackId: Feedback.IsFutureSection,
				// 	options: { sectionNumber: i + 1 },
				// 	isInverted: true,
				// 	style: { color: COLOR_WHITE },
				// }
			],
		},
	]),
)

const nextPrevSongs: CompanionPresetDefinitions = {
	currentSong: {
		name: 'Current Song',
		type: 'simple',
		previewStyle: {
			...defaultSongStyle,
			bgcolor: COLOR_GREEN_500,
			text: `Current Song`,
		},
		style: {
			...defaultSongStyle,
			bgcolor: COLOR_GREEN_500,
			text: `$(AbleSet:activeSongName)`,
		},
		steps: [
			{
				down: [
					{
						actionId: Action.JumpBySongs,
						options: { steps: 0, force: 'true' },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: Feedback.IsQueuedNextSong,
				options: { songDelta: 0 },
				style: { bgcolor: COLOR_GREEN_800 },
			},
		],
	},
	...Object.fromEntries(
		makeRange(RELATIVE_SONG_PRESETS_COUNT).map((_, i) => [
			`nextSong${i + 1}`,
			{
				name: makeOrdinal(i, `Next Song`),
				type: 'simple',
				previewStyle: {
					...defaultSongStyle,
					text: makeOrdinal(i, `Next Song`),
				},
				style: {
					...defaultSongStyle,
					text: `$(AbleSet:nextSongName${i === 0 ? '' : i + 1})`,
				},
				steps: [
					{
						down: [
							{
								actionId: Action.JumpBySongs,
								options: { steps: i + 1, force: 'true' },
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: Feedback.IsQueuedNextSong,
						options: { songDelta: i + 1 },
						style: { bgcolor: COLOR_GREEN_800 },
					},
				],
			},
		]),
	),
	...Object.fromEntries(
		makeRange(RELATIVE_SONG_PRESETS_COUNT).map((_, i) => [
			`previousSong${i + 1}`,
			{
				name: makeOrdinal(i, `Previous Song`),
				type: 'simple',
				previewStyle: {
					...defaultSongStyle,
					text: makeOrdinal(i, `Prev Song`),
				},
				style: {
					...defaultSongStyle,
					text: `$(AbleSet:previousSongName${i === 0 ? '' : i + 1})`,
				},
				steps: [
					{
						down: [
							{
								actionId: Action.JumpBySongs,
								options: { steps: -(i + 1), force: 'true' },
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: Feedback.IsQueuedNextSong,
						options: { songDelta: -(i + 1) },
						style: { bgcolor: COLOR_GREEN_800 },
					},
				],
			},
		]),
	),
}

const nextPrevSections: CompanionPresetDefinitions = {
	currentSection: {
		name: 'Current Section',
		type: 'simple',
		previewStyle: {
			...defaultSongStyle,
			bgcolor: COLOR_GREEN_500,
			text: `Current Section`,
		},
		style: {
			...defaultSongStyle,
			bgcolor: COLOR_GREEN_500,
			text: `$(AbleSet:activeSectionName)`,
		},
		steps: [
			{
				down: [
					{
						actionId: Action.JumpBySections,
						options: { steps: 0, force: 'true' },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: Feedback.SectionColor,
				options: { relative: true, sectionNumber: 0, colorProps: ['bgcolor'] },
			},
			{
				feedbackId: Feedback.SectionProgressByNumber,
				options: { relative: true, sectionNumber: 0, style: 'fullTransparent' },
			},
			{
				feedbackId: Feedback.IsQueuedNextSection,
				options: { sectionDelta: 0 },
				style: { bgcolor: COLOR_GREEN_800 },
			},
		],
	},
	...Object.fromEntries(
		makeRange(RELATIVE_SECTION_PRESETS_COUNT).map((_, i) => [
			`nextSection${i + 1}`,
			{
				name: makeOrdinal(i, `Next Section`),
				type: 'simple',
				previewStyle: {
					...defaultSongStyle,
					text: makeOrdinal(i, `Next Section`),
				},
				style: {
					...defaultSongStyle,
					text: `$(AbleSet:nextSectionName${i === 0 ? '' : i + 1})`,
				},
				steps: [
					{
						down: [
							{
								actionId: Action.JumpBySections,
								options: { steps: i + 1, force: 'true' },
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: Feedback.SectionColor,
						options: {
							relative: true,
							sectionNumber: i + 1,
							colorProps: ['bgcolor'],
						},
					},
					{
						feedbackId: Feedback.SectionProgressByNumber,
						options: {
							relative: true,
							sectionNumber: i + 1,
							style: 'fullTransparent',
						},
					},
					{
						feedbackId: Feedback.IsQueuedNextSection,
						options: { sectionDelta: i + 1 },
						style: { png64: QUEUED_ICON, color: COLOR_WHITE },
					},
				],
			},
		]),
	),
	...Object.fromEntries(
		makeRange(RELATIVE_SECTION_PRESETS_COUNT).map((_, i) => [
			`previousSection${i + 1}`,
			{
				name: makeOrdinal(i, `Previous Section`),
				type: 'simple',
				previewStyle: {
					...defaultSongStyle,
					text: makeOrdinal(i, `Prev Section`),
				},
				style: {
					...defaultSongStyle,
					text: `$(AbleSet:previousSectionName${i === 0 ? '' : i + 1})`,
				},
				steps: [
					{
						down: [
							{
								actionId: Action.JumpBySections,
								options: { steps: -(i + 1), force: 'true' },
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: Feedback.SectionColor,
						options: {
							relative: true,
							sectionNumber: -(i + 1),
							colorProps: ['bgcolor'],
						},
					},
					{
						feedbackId: Feedback.SectionProgressByNumber,
						options: {
							relative: true,
							sectionNumber: -(i + 1),
							style: 'fullTransparent',
						},
					},
					{
						feedbackId: Feedback.IsQueuedNextSection,
						options: { sectionDelta: -(i + 1) },
						style: { png64: QUEUED_ICON, color: COLOR_WHITE },
					},
				],
			},
		]),
	),
}

const playbackPresets: CompanionPresetDefinitions = {
	playPause: {
		name: 'Toggle Play/Pause',
		type: 'simple',
		style: { ...defaultStyle, text: '', png64: PLAY_ICON },
		previewStyle: {
			...defaultStyle,
			text: 'Play Pause',
			png64: PLAY_ICON_GRAY,
		},
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
		name: 'Toggle Play/Stop',
		type: 'simple',
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
	toggleRecord: {
		name: 'Toggle Record',
		type: 'simple',
		style: { ...defaultStyle, text: '', png64: RECORD_ICON },
		previewStyle: { ...defaultStyle, text: 'Record', png64: RECORD_ICON_GRAY },
		steps: [{ down: [{ actionId: Action.ToggleRecord, options: {} }], up: [] }],
		feedbacks: [
			{
				feedbackId: Feedback.IsRecording,
				options: {},
				style: { bgcolor: COLOR_RED_600, png64: RECORD_ICON_RED },
			},
		],
	},
	prevSong: {
		name: 'Previous Song',
		type: 'simple',
		style: { ...defaultStyle, text: '', png64: PREV_SONG_ICON_GRAY },
		previewStyle: {
			...defaultStyle,
			text: 'Prev Song',
			png64: PREV_SONG_ICON_GRAY,
		},
		steps: [
			{
				down: [{ actionId: Action.JumpBySongs, options: { steps: -1 } }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: Feedback.CanJumpToPreviousSong,
				options: {},
				style: { png64: PREV_SONG_ICON },
			},
			{
				feedbackId: Feedback.IsQueuedNextSong,
				options: { songDelta: 'anyPrevious' },
				style: { bgcolor: COLOR_GREEN_800 },
			},
		],
	},
	nextSong: {
		name: 'Next Song',
		type: 'simple',
		style: { ...defaultStyle, text: '', png64: NEXT_SONG_ICON_GRAY },
		previewStyle: {
			...defaultStyle,
			text: 'Next Song',
			png64: NEXT_SONG_ICON_GRAY,
		},
		steps: [
			{
				down: [{ actionId: Action.JumpBySongs, options: { steps: 1 } }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: Feedback.CanJumpToNextSong,
				options: {},
				style: { png64: NEXT_SONG_ICON },
			},
			{
				feedbackId: Feedback.IsQueuedNextSong,
				options: { songDelta: 'anyNext' },
				style: { bgcolor: COLOR_GREEN_800 },
			},
		],
	},
	prevSection: {
		name: 'Previous Section',
		type: 'simple',
		style: { ...defaultStyle, color: COLOR_GRAY, text: '<\nSection' },
		steps: [
			{
				down: [{ actionId: Action.JumpBySections, options: { steps: -1 } }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: Feedback.CanJumpToPreviousSection,
				options: {},
				style: { color: COLOR_WHITE },
			},
			{
				feedbackId: Feedback.IsQueuedNextSection,
				options: { sectionDelta: 'anyPrevious' },
				style: { bgcolor: COLOR_GREEN_800 },
			},
		],
	},
	nextSection: {
		name: 'Next Section',
		type: 'simple',
		style: { ...defaultStyle, color: COLOR_GRAY, text: '>\nSection' },
		steps: [
			{
				down: [{ actionId: Action.JumpBySections, options: { steps: 1 } }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: Feedback.CanJumpToNextSection,
				options: {},
				style: { color: COLOR_WHITE },
			},
			{
				feedbackId: Feedback.IsQueuedNextSection,
				options: { sectionDelta: 'anyNext' },
				style: { bgcolor: COLOR_GREEN_800 },
			},
		],
	},
	prevBar: {
		name: 'Previous Bar',
		type: 'simple',
		style: { ...defaultStyle, text: '', png64: PREV_BAR_ICON },
		previewStyle: {
			...defaultStyle,
			text: 'Prev Bar',
			png64: PREV_BAR_ICON_GRAY,
		},
		steps: [
			{
				down: [{ actionId: Action.JumpByBars, options: { steps: -1 } }],
				up: [],
			},
		],
		feedbacks: [],
	},
	nextBar: {
		name: 'Next Song',
		type: 'simple',
		style: { ...defaultStyle, text: '', png64: NEXT_BAR_ICON },
		previewStyle: {
			...defaultStyle,
			text: 'Next Bar',
			png64: NEXT_BAR_ICON_GRAY,
		},
		steps: [
			{
				down: [{ actionId: Action.JumpByBars, options: { steps: 1 } }],
				up: [],
			},
		],
		feedbacks: [],
	},
	toggleLoop: {
		name: 'Toggle Loop',
		type: 'simple',
		style: {
			...defaultStyle,
			color: COLOR_GRAY,
			text: '',
			png64: LOOP_ICON_GRAY,
		},
		steps: [{ down: [{ actionId: Action.ToggleLoop, options: {} }], up: [] }],
		feedbacks: [
			{
				feedbackId: Feedback.IsInLoop,
				options: {},
				style: { png64: LOOP_ICON },
			},
			{
				feedbackId: Feedback.IsInActiveLoop,
				options: {},
				style: { bgcolor: COLOR_GREEN_700, png64: LOOP_ICON_GREEN },
			},
		],
	},
	playbackPosition: {
		name: 'Playback Position',
		type: 'simple',
		style: { ...defaultStyle, text: '$(AbleSet:currentMeasureOrPosition)' },
		steps: [],
		feedbacks: [],
	},
	playbackPositionBeats: {
		name: 'Current Beat',
		type: 'simple',
		style: {
			...defaultStyle,
			size: 'auto',
			text: '$(AbleSet:currentMeasureOrPositionBeats)',
		},
		previewStyle: { ...defaultSongStyle, text: 'Beat\n1/2/3/4' },
		steps: [],
		feedbacks: [],
	},
	timeSignature: {
		name: 'Time Signature',
		type: 'simple',
		style: { ...defaultStyle, text: '$(AbleSet:timeSignature)' },
		steps: [],
		feedbacks: [],
	},
	clickSolo: {
		name: 'Solo Click Tracks',
		type: 'simple',
		style: { ...defaultStyle, text: 'Solo Click' },
		steps: [
			{
				down: [
					{
						actionId: Action.SetTrackGroupState,
						options: { group: 'click', type: 'solo', value: 'toggle' },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: Feedback.IsTrackGroupSoloed,
				options: { group: 'click' },
				style: { bgcolor: COLOR_RED_700 },
			},
		],
	},
	clickMute: {
		name: 'Mute Click Tracks',
		type: 'simple',
		style: { ...defaultStyle, text: 'Mute Click' },
		steps: [
			{
				down: [
					{
						actionId: Action.SetTrackGroupState,
						options: { group: 'click', type: 'mute', value: 'toggle' },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: Feedback.IsTrackGroupMuted,
				options: { group: 'click' },
				style: { bgcolor: COLOR_RED_700 },
			},
		],
	},
	remainingSongTime: {
		name: 'Remaining Time in Song',
		type: 'simple',
		style: { ...defaultStyle, text: '-$(AbleSet:remainingTimeInSongFormatted)' },
		previewStyle: { ...defaultSongStyle, text: 'Remaining Song Time' },
		steps: [],
		feedbacks: [],
	},
	remainingSetTime: {
		name: 'Remaining Time in Song',
		type: 'simple',
		style: { ...defaultStyle, text: '-$(AbleSet:remainingTimeInSetFormatted)' },
		previewStyle: { ...defaultSongStyle, text: 'Remaining Set Time' },
		steps: [],
		feedbacks: [],
	},
}

const visualMetronomePresets: CompanionPresetDefinitions = Object.fromEntries(
	makeRange(16).map((i) => [
		`beat${i + 1}`,
		{
			name: `Beat ${i + 1}`,
			type: 'simple',
			style: {
				...defaultStyle,
				size: 'auto',
				color: COLOR_DARK_GRAY,
				text: `${i + 1}`,
			},
			previewStyle: { ...defaultStyle, size: 'auto', text: `${i + 1}` },
			steps: [],
			feedbacks: [
				{
					feedbackId: Feedback.BeatIsInBar,
					options: { beat: i + 1 },
					style: { color: COLOR_WHITE },
				},
				{
					feedbackId: Feedback.IsBeat,
					options: { beat: i + 1 },
					style: { bgcolor: COLOR_GREEN_500 },
				},
			],
		},
	]),
)

const booleanSettingsPresets: CompanionPresetDefinitions = Object.fromEntries(
	BOOLEAN_SETTINGS.map((s) => [
		s.id,
		{
			name: s.label,
			type: 'simple',
			style: { ...defaultSongStyle, text: s.label },
			steps: [
				{
					down: [{ actionId: Action.ToggleSetting, options: { setting: s.id } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: Feedback.SettingEqualsValue,
					options: { setting: s.id, value: 'true' },
					style: { bgcolor: COLOR_GREEN_500 },
				},
			],
		},
	]),
)

const countInDurationSettingsPresets: CompanionPresetDefinitions = Object.fromEntries(
	COUNT_IN_DURATIONS.map((s) => [
		s.id,
		{
			name: `Count-In Duration / ${s.label}`,
			type: 'simple',
			style: { ...defaultSongStyle, text: s.label },
			previewStyle: { ...defaultSongStyle, text: `Count-In\n${s.label}` },
			steps: [
				{
					down: [{ actionId: Action.SetCountInDuration, options: { value: s.id } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: Feedback.SettingEqualsValue,
					options: { setting: 'countInDuration', value: s.id },
					style: { bgcolor: COLOR_GREEN_500 },
				},
			],
		},
	]),
)

const jumpModeSettingsPresets: CompanionPresetDefinitions = Object.fromEntries(
	JUMP_MODES.map((s) => [
		s.id,
		{
			name: `Jump Mode / ${s.label}`,
			type: 'simple',
			style: { ...defaultSongStyle, text: s.label },
			previewStyle: { ...defaultSongStyle, text: `Jump:\n${s.label}` },
			steps: [
				{
					down: [{ actionId: Action.SetJumpMode, options: { value: s.id } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: Feedback.SettingEqualsValue,
					options: { setting: 'jumpMode', value: s.id },
					style: { bgcolor: COLOR_GREEN_500 },
				},
			],
		},
	]),
)

const audioInterfacePresets: PresetsWithCategory = {
	playAudio12: {
		category: 'Audio Interface',
		name: 'Audio Interface Scene',
		type: 'simple',
		previewStyle: { ...defaultSongStyle, text: `Audio Interface` },
		style: { ...defaultSongStyle, color: COLOR_GRAY, text: `Audio Interface` },
		steps: [{ down: [{ actionId: Action.AudioInterfaceToggleScene, options: {} }], up: [] }],
		feedbacks: [
			{
				feedbackId: Feedback.AudioInterfaceConnected,
				options: {},
				style: { color: COLOR_WHITE, text: `Audio Interface` },
			},
			{
				feedbackId: Feedback.AudioInterfaceScene,
				options: { scene: 1 },
				style: { bgcolor: COLOR_GREEN_800, text: `Scene A` },
			},
			{
				feedbackId: Feedback.AudioInterfaceScene,
				options: { scene: 2 },
				style: { bgcolor: COLOR_RED_700, text: `Scene B` },
			},
		],
	},
}

const ableNetPresets: CompanionPresetDefinitions = {
	syncPlaybackNow: {
		name: 'Sync Playback Now',
		type: 'simple',
		previewStyle: { ...defaultSongStyle, text: `Sync Playback Now` },
		style: { ...defaultSongStyle, text: `Sync Playback Now` },
		steps: [{ down: [{ actionId: Action.SyncPlaybackNow, options: {} }], up: [] }],
		feedbacks: [
			{
				feedbackId: Feedback.IsSyncingPlayback,
				options: {},
				style: { bgcolor: COLOR_GREEN_700, text: `Syncing...` },
			},
		],
	},
}

const timecodePresets: CompanionPresetDefinitions = {
	timecodeHours: {
		name: 'Timecode Hours',
		type: 'simple',
		previewStyle: { ...defaultStyle, size: '30', text: `HH` },
		style: {
			...defaultStyle,
			color: COLOR_GRAY,
			size: '44',
			text: `$(AbleSet:timecodeHours)`,
		},
		feedbacks: [
			{
				feedbackId: Feedback.IsTimecodeActive,
				options: {},
				style: { color: COLOR_WHITE },
			},
		],
		steps: [],
	},
	timecodeMinutes: {
		name: 'Timecode Minutes',
		type: 'simple',
		previewStyle: { ...defaultStyle, size: '30', text: `MM` },
		style: {
			...defaultStyle,
			color: COLOR_GRAY,
			size: '44',
			text: `$(AbleSet:timecodeMinutes)`,
		},
		feedbacks: [
			{
				feedbackId: Feedback.IsTimecodeActive,
				options: {},
				style: { color: COLOR_WHITE },
			},
		],
		steps: [],
	},
	timecodeSeconds: {
		name: 'Timecode Seconds',
		type: 'simple',
		previewStyle: { ...defaultStyle, size: '30', text: `SS` },
		style: {
			...defaultStyle,
			color: COLOR_GRAY,
			size: '44',
			text: `$(AbleSet:timecodeSeconds)`,
		},
		feedbacks: [
			{
				feedbackId: Feedback.IsTimecodeActive,
				options: {},
				style: { color: COLOR_WHITE },
			},
		],
		steps: [],
	},
	timecodeFrames: {
		name: 'Timecode Frames',
		type: 'simple',
		previewStyle: { ...defaultStyle, size: '30', text: `FF` },
		style: {
			...defaultStyle,
			color: COLOR_GRAY,
			size: '44',
			text: `$(AbleSet:timecodeFrames)`,
		},
		feedbacks: [
			{
				feedbackId: Feedback.IsTimecodeActive,
				options: {},
				style: { color: COLOR_WHITE },
			},
		],
		steps: [],
	},
	timecode: {
		name: 'Timecode',
		type: 'simple',
		previewStyle: { ...defaultStyle, size: '18', text: 'HH:MM:SS:FF' },
		style: {
			...defaultStyle,
			color: COLOR_GRAY,
			size: '24',
			text: `$(AbleSet:timecode)`,
		},
		feedbacks: [
			{
				feedbackId: Feedback.IsTimecodeActive,
				options: {},
				style: { color: COLOR_WHITE },
			},
		],
		steps: [],
	},
	timecodeMinutesSeconds: {
		name: 'Timecode Minutes and Seconds',
		type: 'simple',
		previewStyle: { ...defaultStyle, size: '18', text: 'MM:SS' },
		style: {
			...defaultStyle,
			color: COLOR_GRAY,
			size: '24',
			text: `$(AbleSet:timecodeMinutes):$(AbleSet:timecodeSeconds)`,
		},
		feedbacks: [
			{
				feedbackId: Feedback.IsTimecodeActive,
				options: {},
				style: { color: COLOR_WHITE },
			},
		],
		steps: [],
	},
	timecodeFps: {
		name: 'Timecode FPS',
		type: 'simple',
		previewStyle: { ...defaultStyle, size: '24', text: `30 FPS` },
		style: {
			...defaultStyle,
			color: COLOR_GRAY,
			size: '24',
			text: `$(AbleSet:timecodeFps) FPS`,
		},
		feedbacks: [
			{
				feedbackId: Feedback.IsTimecodeActive,
				options: {},
				style: { color: COLOR_WHITE },
			},
		],
		steps: [],
	},
}

const makeProgressPresets = (
	buttonCount: number,
	feedbackId: Feedback.SongProgress | Feedback.SectionProgress,
	style: 'full' | 'slim',
): CompanionPresetDefinitions => {
	const category = feedbackId === Feedback.SongProgress ? 'Song Progress' : 'Section Progress'

	return Object.fromEntries(
		makeRange(buttonCount).map((i) => {
			const buttonNumber = i + 1
			const buttonText = `${buttonNumber}/${buttonCount}`

			const previewBackground =
				style === 'slim'
					? buttonNumber === 1
						? PROGRESS.slimLeft[72]
						: buttonNumber === buttonCount
							? PROGRESS.slimRight[72]
							: PROGRESS.slimMid[72]
					: undefined

			return [
				`${feedbackId}${style}${buttonNumber}${buttonCount}`,
				{
					name: `${category} (${buttonText})`,
					type: 'simple',
					previewStyle: {
						...defaultStyle,
						size: '30',
						bgcolor: COLOR_GREEN_800,
						text: `${buttonText}`,
						png64: previewBackground,
					},
					style: { ...defaultStyle, bgcolor: COLOR_GREEN_800, text: '' },
					feedbacks: [
						{
							feedbackId: Feedback.IsPlaying,
							options: {},
							style: { bgcolor: COLOR_GREEN_700 },
						},
						{ feedbackId, options: { buttonCount, buttonNumber, style } },
					],
					steps: [],
				},
			]
		}),
	)
}

const songProgressPresets = {
	...makeProgressPresets(1, Feedback.SongProgress, 'full'),
	...makeProgressPresets(2, Feedback.SongProgress, 'full'),
	...makeProgressPresets(4, Feedback.SongProgress, 'full'),
	...makeProgressPresets(8, Feedback.SongProgress, 'full'),
	...makeProgressPresets(2, Feedback.SongProgress, 'slim'),
	...makeProgressPresets(4, Feedback.SongProgress, 'slim'),
	...makeProgressPresets(8, Feedback.SongProgress, 'slim'),
}

const sectionProgressPresets = {
	...makeProgressPresets(1, Feedback.SectionProgress, 'full'),
	...makeProgressPresets(2, Feedback.SectionProgress, 'full'),
	...makeProgressPresets(4, Feedback.SectionProgress, 'full'),
	...makeProgressPresets(8, Feedback.SectionProgress, 'full'),
	...makeProgressPresets(2, Feedback.SectionProgress, 'slim'),
	...makeProgressPresets(4, Feedback.SectionProgress, 'slim'),
	...makeProgressPresets(8, Feedback.SectionProgress, 'slim'),
}

const presetCategories: Array<{ id: string; name: string; presets: CompanionPresetDefinitions }> = [
	{ id: 'song', name: 'Absolute Songs', presets: songPresets },
	{ id: 'section', name: 'Absolute Sections', presets: sectionPresets },
	{ id: 'nextPrevSongs', name: 'Relative Songs', presets: nextPrevSongs },
	{ id: 'nextPrevSections', name: 'Relative Sections', presets: nextPrevSections },
	{ id: 'playback', name: 'Playback', presets: playbackPresets },
	{ id: 'songProgress', name: 'Song Progress', presets: songProgressPresets },
	{ id: 'sectionProgress', name: 'Section Progress', presets: sectionProgressPresets },
	{ id: 'audioInterface', name: 'Audio Interfaces', presets: audioInterfacePresets },
	{ id: 'ableNet', name: 'AbleNet', presets: ableNetPresets },
	{ id: 'timecode', name: 'LTC Timecode', presets: timecodePresets },
	{ id: 'visualMetronome', name: 'Visual Metronome', presets: visualMetronomePresets },
	{
		id: 'settings',
		name: 'Settings',
		presets: {
			...booleanSettingsPresets,
			...countInDurationSettingsPresets,
			...jumpModeSettingsPresets,
		},
	},
]

export const presets: CompanionPresetDefinitions = Object.fromEntries(
	presetCategories.flatMap((c) => Object.entries(c.presets).map(([id, preset]) => [id, preset])),
)

export const presetStructure: CompanionPresetSection[] = presetCategories.map((c) => ({
	id: c.id,
	name: c.name,
	definitions: Object.keys(c.presets),
}))
