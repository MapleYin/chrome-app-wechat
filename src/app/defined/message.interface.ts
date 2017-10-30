import {EMessageType,EAppMsgType} from './message.enum'

export interface IMessage {
	MsgId?: string;
	LocalID?: string;
	ClientMsgId?:string;
	CreateTime : number;
	Content : string;
	FromUserName : string;
	ToUserName : string;
	MsgType : EMessageType;
    HasProductId?: number;
	SubMsgType?: EMessageType;
	AppMsgType?: EAppMsgType;
	FileName?: string;
	FileSize?: string;
	ForwardFlag?: number;
	Status?: number;
	StatusNotifyCode?: number;
	StatusNotifyUserName?: string;
	Url?: string;
	VoiceLength?: number;

	RecommendInfo?:IRecommendInfo;
}


export interface IRecommendInfo {
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