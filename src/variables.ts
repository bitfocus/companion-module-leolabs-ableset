import { CompanionVariableDefinition } from '@companion-module/base'
import { SECTION_PRESET_COUNT, SONG_PRESET_COUNT } from './constants'

export const variables: CompanionVariableDefinition[] = [
	{ variableId: 'beatsPosition', name: 'Playhead Position in Beats' },
	{ variableId: 'humanPosition', name: 'Playhead Position in Bars.Beats' },
	{ variableId: 'humanPositionBeats', name: 'Beats Part of the Playhead Position' },
	{ variableId: 'tempo', name: 'Current Tempo' },
	{ variableId: 'isPlaying', name: 'Is Playing' },
	{ variableId: 'timeSignature', name: 'Time Signature' },
	{ variableId: 'timeSignatureNumerator', name: 'Time Signature Numerator' },
	{ variableId: 'timeSignatureDenominator', name: 'Time Signature Denominator' },

	{ variableId: 'setlistName', name: 'Setlist Name' },
	{ variableId: 'activeSongName', name: 'Active Song Name' },
	{ variableId: 'activeSongIndex', name: 'Active Song Index' },
	{ variableId: 'activeSongStart', name: 'Active Song Start' },
	{ variableId: 'activeSongEnd', name: 'Active Song End' },
	{ variableId: 'queuedSongName', name: 'Queued Song Name' },
	{ variableId: 'queuedSongIndex', name: 'Queued Song Index' },

	{ variableId: 'activeSectionName', name: 'Active Section Name' },
	{ variableId: 'activeSectionIndex', name: 'Active Section Index' },
	{ variableId: 'activeSectionStart', name: 'Active Section Start' },
	{ variableId: 'activeSectionEnd', name: 'Active Section End' },
	{ variableId: 'queuedSectionName', name: 'Queued Section Name' },
	{ variableId: 'queuedSectionIndex', name: 'Queued Section Index' },
	{ variableId: 'sectionsCount', name: 'Count of Sections in a Song' },

	...Array(SONG_PRESET_COUNT)
		.fill(0)
		.map((_, i) => ({ variableId: `song${i + 1}Name`, name: `Song ${i + 1} Name` })),
	...Array(SECTION_PRESET_COUNT)
		.fill(0)
		.map((_, i) => ({ variableId: `section${i + 1}Name`, name: `Section ${i + 1} Name` })),
	...Array(SECTION_PRESET_COUNT)
		.fill(0)
		.map((_, i) => ({ variableId: `section${i + 1}Color`, name: `Section ${i + 1} Color` })),

	{ variableId: 'nextSongName', name: 'Next Song Name' },
	{ variableId: 'nextSongName2', name: '2nd Next Song Name' },
	{ variableId: 'nextSongName3', name: '3rd Next Song Name' },
	{ variableId: 'nextSongName4', name: '4th Next Song Name' },
	{ variableId: 'nextSongName5', name: '5th Next Song Name' },
	{ variableId: 'nextSongName6', name: '6th Next Song Name' },
	{ variableId: 'nextSongName7', name: '7th Next Song Name' },
	{ variableId: 'nextSongName8', name: '8th Next Song Name' },
	{ variableId: 'previousSongName', name: 'Previous Song Name' },
	{ variableId: 'previousSongName2', name: '2nd Previous Song Name' },
	{ variableId: 'previousSongName3', name: '3rd Previous Song Name' },
	{ variableId: 'previousSongName4', name: '4th Previous Song Name' },
	{ variableId: 'previousSongName5', name: '5th Previous Song Name' },
	{ variableId: 'previousSongName6', name: '6th Previous Song Name' },
	{ variableId: 'previousSongName7', name: '7th Previous Song Name' },
	{ variableId: 'previousSongName8', name: '8th Previous Song Name' },

	{ variableId: 'nextSectionName', name: 'Next Section Name' },
	{ variableId: 'nextSectionName2', name: '2nd Next Section Name' },
	{ variableId: 'nextSectionName3', name: '3rd Next Section Name' },
	{ variableId: 'nextSectionName4', name: '4th Next Section Name' },
	{ variableId: 'nextSectionName5', name: '5th Next Section Name' },
	{ variableId: 'nextSectionName6', name: '6th Next Section Name' },
	{ variableId: 'nextSectionName7', name: '7th Next Section Name' },
	{ variableId: 'nextSectionName8', name: '8th Next Section Name' },
	{ variableId: 'previousSectionName', name: 'Previous Section Name' },
	{ variableId: 'previousSectionName2', name: '2nd Previous Section Name' },
	{ variableId: 'previousSectionName3', name: '3rd Previous Section Name' },
	{ variableId: 'previousSectionName4', name: '4th Previous Section Name' },
	{ variableId: 'previousSectionName5', name: '5th Previous Section Name' },
	{ variableId: 'previousSectionName6', name: '6th Previous Section Name' },
	{ variableId: 'previousSectionName7', name: '7th Previous Section Name' },
	{ variableId: 'previousSectionName8', name: '8th Previous Section Name' },

	{ variableId: 'loopEnabled', name: 'Loop Enabled' },
	{ variableId: 'loopStart', name: 'Loop Start' },
	{ variableId: 'loopEnd', name: 'Loop End' },
	{ variableId: 'isCountingIn', name: 'Is Counting In' },

	{ variableId: 'playAudio12Connected', name: 'PlayAUDIO12 Connected' },
	{ variableId: 'playAudio12Scene', name: 'PlayAUDIO12 Scene' },

	{ variableId: 'isSyncingPlayback', name: 'Is Syncing Playback to Other Computer' },

	{ variableId: 'timecode', name: 'Timecode' },
	{ variableId: 'timecodeHours', name: 'Timecode Hours' },
	{ variableId: 'timecodeMinutes', name: 'Timecode Minutes' },
	{ variableId: 'timecodeSeconds', name: 'Timecode Seconds' },
	{ variableId: 'timecodeFrames', name: 'Timecode Frames' },
	{ variableId: 'timecodeFps', name: 'Timecode FPS' },
	{ variableId: 'timecodeStale', name: 'Timecode Stale' },

	{ variableId: 'autoplay', name: 'Autoplay' },
	{ variableId: 'safeMode', name: 'Safe Mode' },
	{ variableId: 'alwaysStopOnSongEnd', name: 'Always Stop on Song End' },
	{ variableId: 'autoJumpToNextSong', name: 'Autojump to the Next Song' },
	{ variableId: 'autoLoopCurrentSection', name: 'Autoloop the Current Section' },
	{ variableId: 'countIn', name: 'Count-In' },
	{ variableId: 'countInSoloClick', name: 'Solo Click During Count-In' },
	{ variableId: 'countInDuration', name: 'Count-In Duration' },
	{ variableId: 'jumpMode', name: 'Jump Mode' },
]
