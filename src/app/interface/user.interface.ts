import {IGroupMember} from './group.interface'
export interface IUser {
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

export enum EContactFlag {
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

export enum EUserAttrVerifyFlag {
	BIZ = 1,
	FAMOUS = 2,
	BIZ_BIG = 4,
	BIZ_BRAND = 8,
	BIZ_VERIFIED = 16,
}

export enum EChatRoomNotify {
	CLOSE = 0,
	OPEN = 1
}

export interface IContactHeadImgParams {
	UserName : string;
	MsgId?: string;
	EncryChatRoomId?:string;
}