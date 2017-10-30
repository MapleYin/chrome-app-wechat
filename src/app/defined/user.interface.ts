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
}

export interface IContactHeadImgParams {
	UserName : string;
	MsgId?: string;
	EncryChatRoomId?:string;
}