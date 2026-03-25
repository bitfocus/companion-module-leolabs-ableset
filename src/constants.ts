export const SONG_PRESET_COUNT = 128
export const SECTION_PRESET_COUNT = 48
export const RELATIVE_SECTION_PRESETS_COUNT = 8

export const BOOLEAN_SETTINGS = [
	{ id: 'ableNet', label: 'AbleNet' },
	{ id: 'ableNetDriftCorrection', label: 'Drift Correction' },
	{ id: 'alwaysStopOnSongEnd', label: 'Stop on Song End' },
	{ id: 'autoplay', label: 'Autoplay' },
	{ id: 'autoBackToArrangementOnSongJump', label: 'Back to Arrangement on Song Jump' },
	{ id: 'autoJumpToNextSong', label: 'Autojump to the Next Song' },
	{ id: 'autoReEnableAutomationOnSongJump', label: 'Re-Enable Automation on Song Jump' },
	{ id: 'countIn', label: 'Count-In' },
	{ id: 'countInSoloClick', label: 'Solo Click During Count-In' },
	{ id: 'countInDuration', label: 'Count-In Duration' },
	{ id: 'jumpMode', label: 'Jump Mode' },
	{ id: 'removePlayedSongs', label: 'Remove Played Songs Automatically' },
	{ id: 'safeMode', label: 'Safe Mode' },
	{ id: 'showStopButton', label: 'Stop by Default Instead of Pausing' },
]

export const JUMP_MODES = [
	{ id: 'quantized', label: 'Quantized' },
	{ id: 'end-of-section', label: 'End of Section' },
	{ id: 'end-of-song', label: 'End of Song' },
	{ id: 'dynamic', label: 'Dynamic' },
	{ id: 'manual', label: 'Manual' },
]

export const COUNT_IN_DURATIONS = [
	{ id: '1', label: '1 Bar' },
	{ id: '2', label: '2 Bars' },
	{ id: '4', label: '4 Bars' },
]
