export interface IBaseRequest{
	Uin:string;
	Sid:string;
	Skey:string;
	DeviceID:string;
}

export interface IBaseResponse{
	ErrMsg : string;
	Ret : 0;
}

export interface IBatchgetContactParams{
	UserName : string;
	ChatRoomId? : string;
	EncryChatRoomId? : string;
}

export interface IBatchContactResponse{
	BaseResponse : IBaseResponse;
	ContactList : Array<IUser>;
	Count : number;
}

export interface IContactResponse{
	BaseResponse : IBaseResponse;
	MemberCount : number;
	MemberList : IUser[];
	Seq : number
}

export interface ISyncKey{
	Count:number;
	List:Array<Object>;
}

export interface ISyncResponse{
	BaseResponse : IBaseResponse;
	AddMsgCount : number;
	AddMsgList : Array<IMessage>;
	SyncKey : ISyncKey;
}

export interface IInitInfoResResponse{
	BaseResponse : IBaseResponse;
	ContactList : Array<IUser>;
	Count : number;
	SKey : string;
	SyncKey : ISyncKey;
	User : IUser;
	ChatSet : string;
}

export interface IContactHeadImgParams{
	UserName : string;
	MsgId?: string;
	EncryChatRoomId?:string;
}

export interface IUser{
	UserName : string;

	NickName : string;
	Sex : number;
	RemarkName : string;
	HeadImgUrl : string;
	Signature : string;
	SnsFlag : number;

	City : string;
	Province : string;

	ContactFlag : number;
	VerifyFlag : number;

	AppAccountFlag : number;

	// group
	EncryChatRoomId : string;
	MemberList : Array<IGroupMember>;
	MemberCount : number;
	Statues : number;
};

export interface IMessage{
	MsgId : number;
	LocalID?: number;
	ClientMsgId?:number;
	CreateTime : number;
	Content : string;
	FromUserName : string;
	ToUserName : string;
	MsgType : MessageType;
	SubMsgType : MessageType;
	AppMsgType : AppMsgType;
	FileName : string;
	FileSize : string;
	ForwardFlag : number;
	Status : number;
	StatusNotifyCode : number;
	StatusNotifyUserName : string;
	Url : string;
	VoiceLength : number;

	RecommendInfo?:IRecommendInfo;

	MMDigest?: string;
	MMIsSend?: boolean;
	MMPeerUserName?: string;
	MMIsChatRoom?: boolean;
	MMUnread?: boolean;
	MMActualContent?: string;
	MMActualSender?: string;
}

export interface IRecommendInfo{
	Alias : string;
	AttrStatus : number;
	City : string;
	Content : string;
	NickName : string;
	OpCode : number;
	Province : string;
	QQNum : number;
	Scene : number;
	Sex : number;
	Signature : string;
	Ticket : string;
	UserName : string;
	VerifyFlag : number;
}

export interface IGroupMember{
	NickName : string;
	UserName : string;
	DisplayName : string;
	MemberStatus : number;
	AttrStatus : number;
	HeadImgUrl : string;
}

export enum MessageType{
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

export enum AppMsgType{
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

export enum StatusNotifyCode{
	READED = 1,
	ENTER_SESSION = 2,
	INITED = 3,
	SYNC_CONV = 4,
	QUIT_SESSION = 5
}
export enum ContactFlag{
	CONTACT = 1,
	CHATCONTACT = 2,
	CHATROOMCONTACT = 4,
	BLACKLISTCONTACT = 8,
	DOMAINCONTACT = 16,
	HIDECONTACT = 32,
	FAVOURCONTACT = 64,
	RDAPPCONTACT = 128,
	SNSBLACKLISTCONTACT = 256,
	NOTIFYCLOSECONTACT = 512,
	TOPCONTACT = 2048,
}

export enum UserAttrVerifyFlag{
	BIZ = 1,
	FAMOUS = 2,
	BIZ_BIG = 4,
	BIZ_BRAND = 8,
	BIZ_VERIFIED = 16,
}

export enum ChatRoomNotify{
	CLOSE = 0,
	OPEN = 1
}
export let TextInfoMap = {
	"2457513":"周六",
    "4078104":"[视频]",
    "7068541":"查看详细资料",
    "02d9819":"提示",
    "0d2fc2c":"程序初始化失败，点击确认刷新页面",
    "61e885c":"不允许发送空文件",
    "9a7dbbc":"发送视频文件不允许超过 20MB",
    "76a7e04":"图片上传失败，请检查你的网络",
    "82cf63d":"抱歉，截屏工具暂不支持64位操作系统下的IE浏览器。",
    "112a5c0":"请检查你是否禁用了截屏插件。如果你还没安装截屏插件，点击确定安装。",
    "c5795a7":"图片上传失败，请检查你的网络，",
    "8d521cc":"点击修改备注",
    "5a97440":"我是",
    "f45a3d8":"添加好友失败",
    "84e4fac":"取消置顶",
    "3d43ff1":"置顶",
    "1f9be6d":"修改群名",
    "685739c":"关闭聊天",
    "91382d9":"清屏",
    "b5f1591":"发送消息",
    "0bd10a8":"添加到通讯录",
    "3b61c96":"引用",
    "d9eb6f5":"「",
    "83b6d34":"」",
    "79d3abe":"复制",
    "f26ef91":"下载",
    "21e106f":"转发",
    "0d42740":"创建群聊失败",
    "b3b6735":"最近聊天",
    "845ec73":"图片加载失败，请关闭后重试。",
    "809bb9d":"[表情]",
    "562d747":"周日",
    "1603b06":"周一",
    "b5a6a07":"周二",
    "e60725e":"周三",
    "170fc8e":"周四",
    "eb79cea":"周五",
    "938b111":"该消息网页版微信暂时不支持",
    "a5627e8":"[图片]",
    "b28dac0":"[语音]",
    "1f94b1b":"[小视频]",
    "80f56fb":"[发送了一个表情，请在手机上查看]",
    "2242ac7":"[收到了一个表情，请在手机上查看]",
    "e230fc1":"[动画表情]",
    "fdaa3a3":"[收到一条视频/语音聊天消息，请在手机上查看]",
    "0e23719":"[音乐]",
    "4f20785":"[应用消息]",
    "c4e04ee":"请在手机点击打开",
    "e5b228c":"[链接]",
    "6daeae3":"[文件]",
    "0cdad09":"[收到一条微信转账消息，请在手机上查看]",
    "c534fc3":"[收到一条优惠券消息，请在手机上查看]",
    "8e94ca5":"我发起了位置共享，请在手机上查看",
    "a41d576":"对方",
    "a1f1299":"发起了位置共享，请在手机上查看",
    "95afe20":"[收到一条扫商品消息，请在手机上查看]",
    "355765a":"[收到一条商品消息，请在手机上查看]",
    "9d7f4bb":"[收到一条表情分享消息，请在手机上查看]",
    "e24e75c":"[微信红包]",
    "ded861c":"撤回了一条消息",
    "df1fd91":"你",
    "ebeaf99":"想要将你加为朋友",
    "9a2223f":"你推荐了",
    "dd14577":"向你推荐了",
    "6c2fc35":"微信团队",
    "eb7ec65":"文件传输助手",
    "0469c27":"腾讯新闻",
    "a82c4c4":"朋友推荐消息",
    "f13fb20":"星标好友",
    "59d29a3":"好友",
    "4b0ab7b":"群组",
    "215feec":"公众号",
    "2f521c5":"微信网页版",
    "cfbf6f4":"微信",
    "a7dd12b":"show",
    "a88f05b":"hide",
    "41f984b":"toggle"
}

export let EmojiCodeMap = {
    "1f604": "",
    "1f60a": "",
    "1f603": "",
    "263a": "",
    "1f609": "",
    "1f60d": "",
    "1f618": "",
    "1f61a": "",
    "1f633": "",
    "1f63c": "",
    "1f60c": "",
    "1f61c": "",
    "1f445": "",
    "1f612": "",
    "1f60f": "",
    "1f613": "",
    "1f640": "",
    "1f61e": "",
    "1f616": "",
    "1f625": "",
    "1f630": "",
    "1f628": "",
    "1f62b": "",
    "1f622": "",
    "1f62d": "",
    "1f602": "",
    "1f632": "",
    "1f631": "",
    "1f620": "",
    "1f63e": "",
    "1f62a": "",
    "1f637": "",
    "1f47f": "",
    "1f47d": "",
    2764: "",
    "1f494": "",
    "1f498": "",
    2728: "",
    "1f31f": "",
    2755: "",
    2754: "",
    "1f4a4": "",
    "1f4a6": "",
    "1f3b5": "",
    "1f525": "",
    "1f4a9": "",
    "1f44d": "",
    "1f44e": "",
    "1f44a": "",
    "270c": "",
    "1f446": "",
    "1f447": "",
    "1f449": "",
    "1f448": "",
    "261d": "",
    "1f4aa": "",
    "1f48f": "",
    "1f491": "",
    "1f466": "",
    "1f467": "",
    "1f469": "",
    "1f468": "",
    "1f47c": "",
    "1f480": "",
    "1f48b": "",
    2600: "",
    2614: "",
    2601: "",
    "26c4": "",
    "1f319": "",
    "26a1": "",
    "1f30a": "",
    "1f431": "",
    "1f429": "",
    "1f42d": "",
    "1f439": "",
    "1f430": "",
    "1f43a": "",
    "1f438": "",
    "1f42f": "",
    "1f428": "",
    "1f43b": "",
    "1f437": "",
    "1f42e": "",
    "1f417": "",
    "1f435": "",
    "1f434": "",
    "1f40d": "",
    "1f426": "",
    "1f414": "",
    "1f427": "",
    "1f41b": "",
    "1f419": "",
    "1f420": "",
    "1f433": "",
    "1f42c": "",
    "1f339": "",
    "1f33a": "",
    "1f334": "",
    "1f335": "",
    "1f49d": "",
    "1f383": "",
    "1f47b": "",
    "1f385": "",
    "1f384": "",
    "1f381": "",
    "1f514": "",
    "1f389": "",
    "1f388": "",
    "1f4bf": "",
    "1f4f7": "",
    "1f3a5": "",
    "1f4bb": "",
    "1f4fa": "",
    "1f4de": "",
    "1f513": "",
    "1f512": "",
    "1f511": "",
    "1f528": "",
    "1f4a1": "",
    "1f4eb": "",
    "1f6c0": "",
    "1f4b2": "",
    "1f4a3": "",
    "1f52b": "",
    "1f48a": "",
    "1f3c8": "",
    "1f3c0": "",
    "26bd": "",
    "26be": "",
    "26f3": "",
    "1f3c6": "",
    "1f47e": "",
    "1f3a4": "",
    "1f3b8": "",
    "1f459": "",
    "1f451": "",
    "1f302": "",
    "1f45c": "",
    "1f484": "",
    "1f48d": "",
    "1f48e": "",
    2615: "",
    "1f37a": "",
    "1f37b": "",
    "1f377": "",
    "1f354": "",
    "1f35f": "",
    "1f35d": "",
    "1f363": "",
    "1f35c": "",
    "1f373": "",
    "1f366": "",
    "1f382": "",
    "1f34f": "",
    2708: "",
    "1f680": "",
    "1f6b2": "",
    "1f684": "",
    "26a0": "",
    "1f3c1": "",
    "1f6b9": "",
    "1f6ba": "",
    "2b55": "",
    "274e": "",
    a9: "",
    ae: "",
    2122: ""
}











