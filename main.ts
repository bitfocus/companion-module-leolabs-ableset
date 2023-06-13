import {
	InstanceBase,
	Regex,
	runEntrypoint,
	InstanceStatus,
	SomeCompanionConfigField,
	combineRgb,
} from '@companion-module/base'

class ModuleInstance extends InstanceBase<{}> {
	config: any = {}

	constructor(internal: any) {
		super(internal)
	}

	async init(config: any) {
		this.config = config

		this.updateStatus(InstanceStatus.Ok)
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config: any) {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 4,
				regex: Regex.PORT,
			},
		]
	}

	updateActions() {
		this.setActionDefinitions({
			sample_action: {
				name: 'My First Action',
				options: [
					{
						id: 'num',
						type: 'number',
						label: 'Test',
						default: 5,
						min: 0,
						max: 100,
					},
				],
				callback: async (event) => {
					console.log('Hello world!', event.options.num)
				},
			},
		})
	}

	updateFeedbacks() {
		this.setFeedbackDefinitions({
			ChannelState: {
				name: 'Example Feedback',
				type: 'boolean',
				defaultStyle: {
					bgcolor: combineRgb(255, 0, 0),
					color: combineRgb(0, 0, 0),
				},
				options: [
					{
						id: 'num',
						type: 'number',
						label: 'Test',
						default: 5,
						min: 0,
						max: 10,
					},
				],
				callback: (feedback) => {
					console.log('Hello world!', feedback.options.num)
					if (Number(feedback.options.num) > 5) {
						return true
					} else {
						return false
					}
				},
			},
		})
	}

	updateVariableDefinitions() {
		this.setVariableDefinitions([
			{ variableId: 'variable1', name: 'My first variable' },
			{ variableId: 'variable2', name: 'My second variable' },
			{ variableId: 'variable3', name: 'Another variable' },
		])
	}
}

runEntrypoint(ModuleInstance, [])
