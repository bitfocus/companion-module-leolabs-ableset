/** Available feedbacks */
export const enum Feedback {
	IsPlaying = 'isPlaying',
	IsRecording = 'isRecording',
	IsBeat = 'isBeat',
	BeatIsInBar = 'beatIsInBar',
	IsInLoop = 'isInLoop',
	IsInActiveLoop = 'isInActiveLoop',
	IsCurrentSong = 'isCurrentSong',
	IsCurrentSection = 'isCurrentSection',
	IsFutureSection = 'isFutureSection',
	SectionColor = 'sectionColor',
	SongProgress = 'songProgress',
	SectionProgress = 'sectionProgress',
	SectionProgressByNumber = 'sectionProgressByNumber',
	IsQueuedSong = 'isQueuedSong',
	IsQueuedNextSong = 'isQueuedNextSong',
	IsQueuedSection = 'isQueuedSection',
	IsQueuedNextSection = 'isQueuedNextSection',
	CanJumpToNextSong = 'canJumpToNextSong',
	CanJumpToPreviousSong = 'canJumpToPreviousSong',
	CanJumpToNextSection = 'canJumpToNextSection',
	CanJumpToPreviousSection = 'canJumpToPreviousSection',
	SettingEqualsValue = 'settingEqualsValue',
	PlayAudio12IsConnected = 'playAudio12IsConnected',
	PlayAudio12Scene = 'playAudio12Scene',
	IsTimecodeActive = 'isTimecodeActive',
	IsSyncingPlayback = 'isSyncingPlayback',
}

/** Available actions */
export const enum Action {
	Play = 'play',
	Pause = 'pause',
	Stop = 'stop',
	PlayPause = 'playPause',
	PlayStop = 'playStop',
	Record = 'record',
	StopRecord = 'stopRecord',
	ToggleRecord = 'toggleRecord',
	EnableLoop = 'enableLoop',
	EscapeLoop = 'escapeLoop',
	ToggleLoop = 'toggleLoop',
	JumpToSongByNumber = 'jumpToSongByNumber',
	JumpToSongByName = 'jumpToSongByName',
	JumpBySongs = 'jumpBySongs',
	JumpByBeats = 'jumpByBeats',
	JumpByBars = 'jumpByBars',
	JumpToSectionByNumber = 'jumpToSectionByNumber',
	JumpToSectionByName = 'jumpToSectionByName',
	JumpBySections = 'jumpBySections',
	PlayCuedSong = 'playCuedSong',
	Pa12SetScene = 'pa12SetScene',
	Pa12ToggleScene = 'pa12ToggleScene',
	SyncPlaybackNow = 'syncPlaybackNow',
	ToggleSetting = 'toggleSetting',
	SetAutoplay = 'setAutoplay',
	SetSafeMode = 'setSafeMode',
	SetAlwaysStopOnSongEnd = 'setAlwaysStopOnSongEnd',
	SetAutoJumpToNextSong = 'setAutoJumpToNextSong',
	SetAutoLoopCurrentSection = 'setAutoLoopCurrentSection',
	SetCountIn = 'setCountIn',
	SetCountInSoloClick = 'setCountInSoloClick',
	SetCountInDuration = 'setCountInDuration',
	SetJumpMode = 'setJumpMode',
	SendOscCommand = 'sendOscCommand',
}
