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
	COLOR_RED_600,
} from './utils/colors'
import { makeRange } from './utils/range'
import {
	BOOLEAN_SETTINGS,
	COUNT_IN_DURATIONS,
	JUMP_MODES,
	SECTION_PRESET_COUNT,
	RELATIVE_SECTION_PRESETS_COUNT,
	SONG_PRESET_COUNT,
} from './constants'
import {
	PLAY_ICON,
	PLAY_ICON_GRAY,
	PAUSE_ICON_GREEN,
	STOP_ICON_GREEN,
	QUEUED_ICON,
	LOOP_ICON_GRAY,
	LOOP_ICON,
	LOOP_ICON_GREEN,
	PROGRESS,
	RECORD_ICON,
	RECORD_ICON_RED,
	RECORD_ICON_GRAY,
	PREV_SONG_ICON_GRAY,
	PREV_SONG_ICON,
	NEXT_SONG_ICON_GRAY,
	NEXT_SONG_ICON,
	PREV_BAR_ICON,
	PREV_BAR_ICON_GRAY,
	NEXT_BAR_ICON_GRAY,
	NEXT_BAR_ICON,
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
	nextSong5: {
		category: 'Jump Songs',
		name: '5th Next Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `5th Next Song` },
		style: { ...defaultSongStyle, text: `$(AbleSet:nextSongName5)` },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 5, force: 'true' } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: 5 }, style: { bgcolor: COLOR_GREEN_800 } },
		],
	},
	nextSong6: {
		category: 'Jump Songs',
		name: '6th Next Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `6th Next Song` },
		style: { ...defaultSongStyle, text: `$(AbleSet:nextSongName6)` },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 6, force: 'true' } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: 6 }, style: { bgcolor: COLOR_GREEN_800 } },
		],
	},
	nextSong7: {
		category: 'Jump Songs',
		name: '7th Next Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `7th Next Song` },
		style: { ...defaultSongStyle, text: `$(AbleSet:nextSongName7)` },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 7, force: 'true' } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: 7 }, style: { bgcolor: COLOR_GREEN_800 } },
		],
	},
	nextSong8: {
		category: 'Jump Songs',
		name: '8th Next Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `8th Next Song` },
		style: { ...defaultSongStyle, text: `$(AbleSet:nextSongName8)` },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 8, force: 'true' } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: 8 }, style: { bgcolor: COLOR_GREEN_800 } },
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
	previousSong5: {
		category: 'Jump Songs',
		name: '5th Previous Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `5th Prev Song` },
		style: { ...defaultSongStyle, text: `$(AbleSet:previousSongName5)` },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: -5, force: 'true' } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: -5 }, style: { bgcolor: COLOR_GREEN_800 } },
		],
	},
	previousSong6: {
		category: 'Jump Songs',
		name: '6th Previous Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `6th Prev Song` },
		style: { ...defaultSongStyle, text: `$(AbleSet:previousSongName6)` },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: -6, force: 'true' } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: -6 }, style: { bgcolor: COLOR_GREEN_800 } },
		],
	},
	previousSong7: {
		category: 'Jump Songs',
		name: '7th Previous Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `7th Prev Song` },
		style: { ...defaultSongStyle, text: `$(AbleSet:previousSongName7)` },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: -7, force: 'true' } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: -7 }, style: { bgcolor: COLOR_GREEN_800 } },
		],
	},
	previousSong8: {
		category: 'Jump Songs',
		name: '8th Previous Song',
		type: 'button',
		previewStyle: { ...defaultSongStyle, text: `8th Prev Song` },
		style: { ...defaultSongStyle, text: `$(AbleSet:previousSongName8)` },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: -8, force: 'true' } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.IsQueuedNextSong, options: { songDelta: -8 }, style: { bgcolor: COLOR_GREEN_800 } },
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
		Array(RELATIVE_SECTION_PRESETS_COUNT)
			.fill(0)
			.map((_, i) => [
				`nextSection${i + 1}`,
				{
					category: 'Jump Sections',
					name: `${i + 1} Next Section`,
					type: 'button',
					previewStyle: {
						...defaultSongStyle,
						text: (i === 0 ? '' : i === 1 ? '2nd ' : i === 2 ? '3rd ' : `${i + 1}th `) + 'Next Section',
					},
					style: { ...defaultSongStyle, text: `$(AbleSet:nextSectionName${i === 0 ? '' : i + 1})` },
					steps: [{ down: [{ actionId: Action.JumpBySections, options: { steps: i + 1, force: 'true' } }], up: [] }],
					feedbacks: [
						{
							feedbackId: Feedback.SectionColor,
							options: { relative: true, sectionNumber: i + 1, colorProps: ['bgcolor'] },
						},
						{
							feedbackId: Feedback.SectionProgressByNumber,
							options: { relative: true, sectionNumber: i + 1, style: 'fullTransparent' },
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
		Array(RELATIVE_SECTION_PRESETS_COUNT)
			.fill(0)
			.map((_, i) => [
				`previousSection${i + 1}`,
				{
					category: 'Jump Sections',
					name: `${i + 1} Previous Section`,
					type: 'button',
					previewStyle: {
						...defaultSongStyle,
						text: (i === 0 ? '' : i === 1 ? '2nd ' : i === 2 ? '3rd ' : `${i + 1}th `) + 'Previous Section',
					},
					style: { ...defaultSongStyle, text: `$(AbleSet:previousSectionName${i === 0 ? '' : i + 1})` },
					steps: [{ down: [{ actionId: Action.JumpBySections, options: { steps: -(i + 1), force: 'true' } }], up: [] }],
					feedbacks: [
						{
							feedbackId: Feedback.SectionColor,
							options: { relative: true, sectionNumber: -(i + 1), colorProps: ['bgcolor'] },
						},
						{
							feedbackId: Feedback.SectionProgressByNumber,
							options: { relative: true, sectionNumber: -(i + 1), style: 'fullTransparent' },
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
	toggleRecord: {
		category: 'Playback',
		name: 'Toggle Record',
		type: 'button',
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
		category: 'Playback',
		name: 'Previous Song',
		type: 'button',
		style: { ...defaultStyle, text: '', png64: PREV_SONG_ICON_GRAY },
		previewStyle: { ...defaultStyle, text: 'Prev Song', png64: PREV_SONG_ICON_GRAY },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: -1 } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.CanJumpToPreviousSong, options: {}, style: { png64: PREV_SONG_ICON } },
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
		style: { ...defaultStyle, text: '', png64: NEXT_SONG_ICON_GRAY },
		previewStyle: { ...defaultStyle, text: 'Next Song', png64: NEXT_SONG_ICON_GRAY },
		steps: [{ down: [{ actionId: Action.JumpBySongs, options: { steps: 1 } }], up: [] }],
		feedbacks: [
			{ feedbackId: Feedback.CanJumpToNextSong, options: {}, style: { png64: NEXT_SONG_ICON } },
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
	prevBar: {
		category: 'Playback',
		name: 'Previous Bar',
		type: 'button',
		style: { ...defaultStyle, text: '', png64: PREV_BAR_ICON },
		previewStyle: { ...defaultStyle, text: 'Prev Bar', png64: PREV_BAR_ICON_GRAY },
		steps: [{ down: [{ actionId: Action.JumpByBars, options: { steps: -1 } }], up: [] }],
		feedbacks: [],
	},
	nextBar: {
		category: 'Playback',
		name: 'Next Song',
		type: 'button',
		style: { ...defaultStyle, text: '', png64: NEXT_BAR_ICON },
		previewStyle: { ...defaultStyle, text: 'Next Bar', png64: NEXT_BAR_ICON_GRAY },
		steps: [{ down: [{ actionId: Action.JumpByBars, options: { steps: 1 } }], up: [] }],
		feedbacks: [],
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
		style: { ...defaultStyle, text: '$(AbleSet:currentMeasureOrPosition)' },
		steps: [],
		feedbacks: [],
	},
	playbackPositionBeats: {
		category: 'Playback',
		name: 'Current Beat',
		type: 'button',
		style: { ...defaultStyle, size: 'auto', text: '$(AbleSet:currentMeasureOrPositionBeats)' },
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
	clickSolo: {
		category: 'Playback',
		name: 'Solo Click Tracks',
		type: 'button',
		style: { ...defaultStyle, text: 'Solo Click' },
		steps: [
			{
				down: [{ actionId: Action.SetTrackGroupState, options: { group: 'click', type: 'solo', value: 'toggle' } }],
				up: [],
			},
		],
		feedbacks: [
			{ feedbackId: Feedback.IsTrackGroupSoloed, options: { group: 'click' }, style: { bgcolor: COLOR_RED_700 } },
		],
	},
	clickMute: {
		category: 'Playback',
		name: 'Mute Click Tracks',
		type: 'button',
		style: { ...defaultStyle, text: 'Mute Click' },
		steps: [
			{
				down: [{ actionId: Action.SetTrackGroupState, options: { group: 'click', type: 'mute', value: 'toggle' } }],
				up: [],
			},
		],
		feedbacks: [
			{ feedbackId: Feedback.IsTrackGroupMuted, options: { group: 'click' }, style: { bgcolor: COLOR_RED_700 } },
		],
	},
}

const beatPresets = Object.fromEntries(
	makeRange(16).map((i) => [
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

const ableNetPresets: CompanionPresetDefinitions = {
	playAudio12: {
		category: 'AbleNet',
		name: 'Sync Playback Now',
		type: 'button',
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
					category,
					name: `${category} (${buttonText})`,
					type: 'button',
					previewStyle: {
						...defaultStyle,
						size: '30',
						bgcolor: COLOR_GREEN_800,
						text: `${buttonText}`,
						png64: previewBackground,
					},
					style: { ...defaultStyle, bgcolor: COLOR_GREEN_800, text: '' },
					feedbacks: [
						{ feedbackId: Feedback.IsPlaying, options: {}, style: { bgcolor: COLOR_GREEN_700 } },
						{ feedbackId, options: { buttonCount, buttonNumber, style } },
					],
					steps: [],
				} satisfies CompanionButtonPresetDefinition,
			]
		}),
	)
}

const progressPresets = {
	...makeProgressPresets(1, Feedback.SongProgress, 'full'),
	...makeProgressPresets(2, Feedback.SongProgress, 'full'),
	...makeProgressPresets(4, Feedback.SongProgress, 'full'),
	...makeProgressPresets(8, Feedback.SongProgress, 'full'),
	...makeProgressPresets(2, Feedback.SongProgress, 'slim'),
	...makeProgressPresets(4, Feedback.SongProgress, 'slim'),
	...makeProgressPresets(8, Feedback.SongProgress, 'slim'),
	...makeProgressPresets(1, Feedback.SectionProgress, 'full'),
	...makeProgressPresets(2, Feedback.SectionProgress, 'full'),
	...makeProgressPresets(4, Feedback.SectionProgress, 'full'),
	...makeProgressPresets(8, Feedback.SectionProgress, 'full'),
	...makeProgressPresets(2, Feedback.SectionProgress, 'slim'),
	...makeProgressPresets(4, Feedback.SectionProgress, 'slim'),
	...makeProgressPresets(8, Feedback.SectionProgress, 'slim'),
}

export const presets: CompanionPresetDefinitions = {
	...songPresets,
	...sectionPresets,
	...nextPrevSongs,
	...nextPrevSections,
	...playbackPresets,
	...progressPresets,
	...playAudio12Presets,
	...ableNetPresets,
	...timecodePresets,
	...beatPresets,
	...booleanSettingsPresets,
	...countInDurationSettingsPresets,
	...jumpModeSettingsPresets,
}
