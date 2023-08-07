export const SONG_PRESET_COUNT = 64
export const SECTION_PRESET_COUNT = 32

export const BOOLEAN_SETTINGS = [
	{ id: 'autoplay', label: 'Autoplay' },
	{ id: 'safeMode', label: 'Safe Mode' },
	{ id: 'alwaysStopOnSongEnd', label: 'Always Stop on Song End' },
	{ id: 'autoJumpToNextSong', label: 'Autojump to the Next Song' },
	{ id: 'autoLoopCurrentSection', label: 'Autoloop the Current Section' },
	{ id: 'countIn', label: 'Count-In' },
	{ id: 'countInSoloClick', label: 'Solo Click During Count-In' },
]

export const JUMP_MODES = [
	{ id: 'quantized', label: 'Quantized' },
	{ id: 'end-of-section', label: 'End of Section' },
	{ id: 'end-of-song', label: 'End of Song' },
	{ id: 'manual', label: 'Manual' },
]

export const COUNT_IN_DURATIONS = [
	{ id: '1', label: '1 Bar' },
	{ id: '2', label: '2 Bars' },
	{ id: '4', label: '4 Bars' },
]
