import { clamp } from 'lodash'

export const PLAY_ICON = '<icon:play.png>'
export const PLAY_ICON_GRAY = '<icon:play-gray.png>'
export const PAUSE_ICON_GREEN = '<icon:pause-green.png>'
export const STOP_ICON_GREEN = '<icon:stop-green.png>'
export const QUEUED_ICON = '<icon:queued.png>'
export const LOOP_ICON = '<icon:loop.png>'
export const LOOP_ICON_GRAY = '<icon:loop-gray.png>'
export const LOOP_ICON_GREEN = '<icon:loop-green.png>'
export const RECORD_ICON = '<icon:record.png>'
export const RECORD_ICON_RED = '<icon:record-red.png>'
export const RECORD_ICON_GRAY = '<icon:record-gray.png>'
export const NEXT_SONG_ICON = '<icon:next-song.png>'
export const PREV_SONG_ICON = '<icon:prev-song.png>'
export const NEXT_SONG_ICON_GRAY = '<icon:next-song-gray.png>'
export const PREV_SONG_ICON_GRAY = '<icon:prev-song-gray.png>'
export const NEXT_BAR_ICON = '<icon:next-bar.png>'
export const PREV_BAR_ICON = '<icon:prev-bar.png>'
export const NEXT_BAR_ICON_GRAY = '<icon:next-bar-gray.png>'
export const PREV_BAR_ICON_GRAY = '<icon:prev-bar-gray.png>'

export const PROGRESS = {
	full: ['<icon-dir:progress/72/full>'],
	fullTransparent: ['<icon-dir:progress/72/full-transparent>'],
	slimLeft: ['<icon-dir:progress/72/slim-left>'],
	slimMid: ['<icon-dir:progress/72/slim-mid>'],
	slimRight: ['<icon-dir:progress/72/slim-right>'],
}

/** Returns a progress icon based on the input from 0-1 */
export const getProgressIcon = (progress: number, style: keyof typeof PROGRESS = 'full'): string => {
	const index = Math.round(clamp(progress, 0, 1) * (PROGRESS[style].length - 1))
	return PROGRESS[style][index]
}
