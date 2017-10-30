export enum EMessageType {
	TEXT                 = 1,      // 文本消息
	IMAGE                = 3,      // 图片消息
	VOICE                = 34,     // 语音消息
	VIDEO                = 43,     // 视频消息
	MICROVIDEO           = 62,     // 小视频消息
	EMOTICON             = 47,     // 表情消息
	APP                  = 49,     // 模版消息
	VOIPMSG              = 50,     // 
	VOIPNOTIFY           = 52,
	VOIPINVITE           = 53,
	LOCATION             = 48,     // 地理位置消息
	STATUSNOTIFY         = 51,
	SYSNOTICE            = 9999,
	POSSIBLEFRIEND_MSG   = 40,     // 
	VERIFYMSG            = 37,     // 朋友验证消息
	SHARECARD            = 42,     // 名片分享
	SYS                  = 1e4,    // 系统消息
	RECALLED             = 10002   // 撤回消息
}

export enum EAppMsgType {
	TEXT = 1,
	IMG = 2,
	AUDIO = 3,
	VIDEO = 4,
	URL = 5,
	ATTACH = 6,
	OPEN = 7,
	EMOJI = 8,
	VOICE_REMIND = 9,
	SCAN_GOOD = 10,
	GOOD = 13,
	EMOTION = 15,
	CARD_TICKET = 16,
	REALTIME_SHARE_LOCATION = 17,
	TRANSFERS = 2e3,
	RED_ENVELOPES = 2001,
	READER_TYPE = 100001,
}