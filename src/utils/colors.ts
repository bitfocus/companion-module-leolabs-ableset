import { combineRgb } from '@companion-module/base'

export const COLOR_BLACK = combineRgb(0, 0, 0)
export const COLOR_GRAY = combineRgb(128, 128, 128)
export const COLOR_DARK_GRAY = combineRgb(80, 80, 80)
export const COLOR_WHITE = combineRgb(255, 255, 255)
export const COLOR_GREEN_500 = combineRgb(34, 197, 94)
export const COLOR_GREEN_700 = combineRgb(21, 128, 61)
export const COLOR_GREEN_800 = combineRgb(22, 101, 52)
export const COLOR_RED_600 = combineRgb(220, 38, 38)
export const COLOR_RED_700 = combineRgb(185, 28, 28)
export const COLOR_ORANGE_600 = combineRgb(234, 88, 12)
export const COLOR_AMBER_600 = combineRgb(217, 119, 6)
export const COLOR_YELLOW_600 = combineRgb(202, 138, 4)
export const COLOR_LIME_600 = combineRgb(101, 163, 13)
export const COLOR_GREEN_600 = combineRgb(56, 161, 105)
export const COLOR_EMERALD_600 = combineRgb(5, 150, 105)
export const COLOR_TEAL_600 = combineRgb(13, 148, 136)
export const COLOR_SKY_600 = combineRgb(2, 132, 199)
export const COLOR_BLUE_600 = combineRgb(37, 99, 235)
export const COLOR_VIOLET_600 = combineRgb(124, 58, 237)
export const COLOR_PURPLE_600 = combineRgb(147, 51, 234)
export const COLOR_PINK_600 = combineRgb(219, 39, 119)
export const COLOR_GRAY_600 = combineRgb(75, 85, 99)

//  ["red","orange","amber","yellow","lime","green","emerald","teal","sky","blue","violet","purple","pink","gray"]
export const COLORS = {
	red: COLOR_RED_600,
	orange: COLOR_ORANGE_600,
	amber: COLOR_AMBER_600,
	yellow: COLOR_YELLOW_600,
	lime: COLOR_LIME_600,
	green: COLOR_GREEN_600,
	emerald: COLOR_EMERALD_600,
	teal: COLOR_TEAL_600,
	sky: COLOR_SKY_600,
	blue: COLOR_BLUE_600,
	violet: COLOR_VIOLET_600,
	purple: COLOR_PURPLE_600,
	pink: COLOR_PINK_600,
	gray: COLOR_GRAY_600,
	black: COLOR_BLACK,
} as { [key: string]: number }
