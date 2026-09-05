import type { CompanionStaticUpgradeScript, ExpressionOrValue } from '@companion-module/base'

import type { Config } from './main.js'

/**
 * `setAutoLoopCurrentSection` was removed in AbleSet 3 with no replacement. There is no
 * supported way to delete an action/feedback from an upgrade script -- `CompanionStaticUpgradeResult`
 * only exposes updatedConfig/updatedSecrets/updatedActions/updatedFeedbacks, no removal channel --
 * so any button still referencing the action is left completely untouched: Companion renders an
 * unrecognised actionId as a clearly-flagged "unknown action" that the user can find and delete,
 * and the original ID stays available for a future migration if a replacement ever appears.
 *
 * The generic `toggleSetting` action and `settingEqualsValue` feedback can also reference the
 * removed setting by name via their `setting` option. Those actions/feedbacks are still valid and
 * registered, so Companion won't flag them the way it flags an unknown action -- they would
 * otherwise keep silently sending `/settings/autoLoopCurrentSection` to a server that no longer
 * implements it, with the feedback just evaluating to false forever and no diagnostic. Those
 * option values are rewritten to `STALE_SETTING_MARKER` so they are unmistakably identifiable as
 * broken in the button editor instead of looking like a valid, working setting.
 */
export const upgradeRemoveAutoLoopCurrentSection: CompanionStaticUpgradeScript<Config> = (_context, props) => {
	const REMOVED_SETTING_ID = 'autoLoopCurrentSection'
	const STALE_SETTING_MARKER = 'REMOVED_autoLoopCurrentSection'

	function referencesRemovedSetting(option: ExpressionOrValue<unknown> | undefined): boolean {
		return option !== undefined && !option.isExpression && option.value === REMOVED_SETTING_ID
	}

	const updatedActions = props.actions.filter(
		(action) => action.actionId === 'toggleSetting' && referencesRemovedSetting(action.options.setting),
	)

	for (const action of updatedActions) {
		action.options.setting = { value: STALE_SETTING_MARKER, isExpression: false }
	}

	const updatedFeedbacks = props.feedbacks.filter(
		(feedback) => feedback.feedbackId === 'settingEqualsValue' && referencesRemovedSetting(feedback.options.setting),
	)

	for (const feedback of updatedFeedbacks) {
		feedback.options.setting = { value: STALE_SETTING_MARKER, isExpression: false }
	}

	return {
		updatedConfig: null,
		updatedActions,
		updatedFeedbacks,
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
