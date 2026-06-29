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
