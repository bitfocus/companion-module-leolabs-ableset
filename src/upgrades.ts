import type { CompanionStaticUpgradeScript } from '@companion-module/base'

import type { Config } from './main.js'

/**
 * Removes actions that were deleted from the module so that buttons referencing
 * them don't end up with orphaned, non-loading actions after an upgrade.
 */
export const upgradeRemoveAutoLoopCurrentSection: CompanionStaticUpgradeScript<Config> = (_context, props) => {
	const updatedActions = props.actions.filter((action) => action.actionId === 'setAutoLoopCurrentSection')

	for (const action of updatedActions) {
		action.actionId = ''
	}

	return {
		updatedConfig: null,
		updatedActions,
		updatedFeedbacks: [],
	}
}

/**
 * Renames the PlayAUDIO12-specific actions and feedbacks to the more generic
 * "Audio Interface" naming introduced in 1.8.0 so that existing buttons keep
 * working after the upgrade.
 */

export const upgradeRenamePlayAudio12: CompanionStaticUpgradeScript<Config> = (_context, props) => {
	const ACTION_ID_RENAMES: Record<string, string> = {
		pa12SetScene: 'audioInterfaceSetScene',
		pa12ToggleScene: 'audioInterfaceToggleScene',
	}

	const FEEDBACK_ID_RENAMES: Record<string, string> = {
		playAudio12IsConnected: 'audioInterfaceConnected',
		playAudio12Scene: 'audioInterfaceScene',
	}

	const updatedActions = props.actions.filter((action) => action.actionId in ACTION_ID_RENAMES)

	for (const action of updatedActions) {
		action.actionId = ACTION_ID_RENAMES[action.actionId]
	}

	const updatedFeedbacks = props.feedbacks.filter((feedback) => feedback.feedbackId in FEEDBACK_ID_RENAMES)

	for (const feedback of updatedFeedbacks) {
		feedback.feedbackId = FEEDBACK_ID_RENAMES[feedback.feedbackId]
	}

	return {
		updatedConfig: null,
		updatedActions,
		updatedFeedbacks,
	}
}
