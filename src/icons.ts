import { clamp } from 'lodash'

export const PLAY_ICON = '<icon:play.png>'
export const PLAY_ICON_GRAY = '<icon:play-gray.png>'
export const PAUSE_ICON_GREEN = '<icon:pause-green.png>'
export const STOP_ICON_GREEN = '<icon:stop-green.png>'
export const LOOP_ICON = '<icon:loop.png>'
export const LOOP_ICON_GRAY = '<icon:loop-gray.png>'
export const LOOP_ICON_GREEN = '<icon:loop-green.png>'

export const PROGRESS = {
	full: ['<icon-dir:progress/72/full>'],
	slimLeft: ['<icon-dir:progress/72/slim-left>'],
	slimMid: ['<icon-dir:progress/72/slim-mid>'],
	slimRight: ['<icon-dir:progress/72/slim-right>'],
}

/** Returns a progress icon based on the input from 0-1 */
export const getProgressIcon = (progress: number, style: keyof typeof PROGRESS = 'full') => {
	const index = Math.round(clamp(progress, 0, 1) * (PROGRESS[style].length - 1))
	return PROGRESS[style][index]
}
