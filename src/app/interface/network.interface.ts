import {IUser} from './user.interface'
import {IMessage} from './message.interface'

export interface IBaseRequest {
	Uin:string;
	Sid:string;
	Skey:string;
	DeviceID:string;
}

export interface IBaseResponse {
	ErrMsg : string;
	Ret : 0;
}

export interface IBatchgetContactParams {
	UserName : string;
	ChatRoomId? : string;
	EncryChatRoomId? : string;
}

export interface IBatchContactResponse {
	BaseResponse : IBaseResponse;
	ContactList : Array<IUser>;
	Count : number;
}

export interface IContactResponse {
	BaseResponse : IBaseResponse;
	MemberCount : number;
	MemberList : IUser[];
	Seq : number
}

export interface ISyncKey {
	Count:number;
	List:Array<Object>;
}

export interface ISyncResponse {
	BaseResponse : IBaseResponse;
	AddMsgCount : number;
	AddMsgList : Array<IMessage>;
	SyncKey : ISyncKey;
    SyncCheckKey : ISyncKey;
}

export interface IInitInfoResResponse {
	BaseResponse : IBaseResponse;
	ContactList : Array<IUser>;
	Count : number;
	SKey : string;
	SyncKey : ISyncKey;
	User : IUser;
	ChatSet : string;
}


export enum EStatusNotifyCode {
	READED = 1,
	ENTER_SESSION = 2,
	INITED = 3,
	SYNC_CONV = 4,
	QUIT_SESSION = 5
}

export enum EContactFlag{
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


export enum EUserAttrVerifyFlag{
	BIZ = 1,
	FAMOUS = 2,
	BIZ_BIG = 4,
	BIZ_BRAND = 8,
	BIZ_VERIFIED = 16,
}

export enum EChatRoomNotify{
	CLOSE = 0,
	OPEN = 1
}

export interface IContactHeadImgParams{
	UserName : string;
	MsgId?: string;
	EncryChatRoomId?:string;
}
