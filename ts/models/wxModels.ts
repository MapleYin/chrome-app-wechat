export interface User{
	UserName : string;

	NickName : string;
	RemarkName : string;
	HeadImgUrl : string;
	Signature : string;

	City : string;
	Province : string;

	ContactFlag : number;
	VerifyFlag : number;
	/*
	 0 : 个人或群
	 */

	// group
	EncryChatRoomId : string;
	MemberList : Array<GroupMember>;
	MemberCount : number;
};

export interface WxMessage{
	MsgId : number;
	CreateTime : number;
	AppMsgType : number;
	Content : string;
	StatusNotifyUserName : string;
	FromUserName : string;
	ToUserName : string;
	MsgType : number; 
	/*
	 1  : 文字
	 3  : 图片
	 47 : 
	 49 : 链接消息
	 51 : 系统消息
	 */
}

// export class User implements IUser{
// 	UserName : string;

// 	NickName : string;
// 	HeadImgUrl : string;
// 	Signature : string;

// 	City : string;
// 	Province : string;

// 	ContactFlag : number;
// 	VerifyFlag : number;

// 	// group
// 	EncryChatRoomId : string;
// 	MemberList : Array<GroupMember>;
// 	MemberCount : number;

// 	constructor(){

// 	}



// }


export interface GroupMember{
	NickName : string;
	UserName : string;
	AttrStatus : number;
}