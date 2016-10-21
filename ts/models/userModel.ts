import {IUser,IGroupMember,ContactFlag,ChatRoomNotify,UserAttrVerifyFlag,IContactHeadImgParams} from './wxInterface'
import {CoreServer} from '../servers/coreServer'
import {contactManager} from '../manager/contactManager'


let SpicalAccounts = ["weibo", "qqmail", "fmessage", "tmessage", "qmessage", "qqsync", "floatbottle", "lbsapp", "shakeapp", "medianote", "qqfriend", "readerapp", "blogapp", "facebookapp", "masssendapp", "meishiapp", "feedsapp", "voip", "blogappweixin", "weixin", "brandsessionholder", "weixinreminder", "wxid_novlwrv3lqwv11", "gh_22b87fa7cb3c", "officialaccounts", "notification_messages"];
let ShieldAccounts = ["newsapp", "wxid_novlwrv3lqwv11", "gh_22b87fa7cb3c", "notification_messages"];

export class UserModel{

	// property
	UserName : string;

	NickName : string;
	Sex : number;
	RemarkName : string;
	HeadImgUrl : string;
	Signature : string;

	City : string;
	Province : string;

	NoticeCount : number;

	// group
	EncryChatRoomId : string;
	MemberList : Array<IGroupMember>;
	MemberCount : number;

	private _contactFlag : number;
	private Statues:number;

	// status
	isContact : boolean;
	isBlackContact : boolean;
	isBrandContact : boolean;
	isConversationContact : boolean;
	isRoomContact : boolean = false;
	isMuted : boolean;
	isTop : boolean;
	isShieldUser : boolean;
	hasPhotoAlbum : boolean;
	MMFromBatchget:boolean = false;
	MMBatchgetMember:boolean = false;
	isSelf : boolean = false;


	protected class = (this.constructor as typeof UserModel);

	constructor(userInfo:IUser|IGroupMember,isSelf?:boolean){

		if('ContactFlag' in userInfo) {
			this.updateUserInfo(userInfo as IUser,isSelf);
		}else{
			this.updateMemberInfo(userInfo as IGroupMember);
		}
	}

	set contactFlag(contactFlag : number) {
		this._contactFlag = contactFlag;
		this.isContact = !!(contactFlag & ContactFlag.CONTACT);
		this.isBlackContact = !!(contactFlag & ContactFlag.BLACKLISTCONTACT);
		this.isMuted = this.isRoomContact ? 
			this.Statues === ChatRoomNotify.CLOSE : 
			!!(contactFlag & ContactFlag.NOTIFYCLOSECONTACT);

		this.isTop = !!(contactFlag & ContactFlag.TOPCONTACT);
	}

	updateMemberInfo(memberInfo:IGroupMember){
		this.UserName = memberInfo.UserName;
		this.NickName = memberInfo.NickName;
		this.RemarkName = memberInfo.DisplayName;
		this.HeadImgUrl = memberInfo.HeadImgUrl;
	}

	updateUserInfo(userInfo:IUser,isSelf?:boolean){
		// property
		this.UserName = userInfo.UserName;
		this.NickName = userInfo.NickName;
		this.Sex = userInfo.Sex;
		this.RemarkName = userInfo.RemarkName;
		this.HeadImgUrl = userInfo.HeadImgUrl;
		this.Signature = userInfo.Signature;
		this.City = userInfo.City;
		this.Province = userInfo.Province;
		this.EncryChatRoomId = userInfo.EncryChatRoomId;
		this.MemberList = userInfo.MemberList;
		this.MemberCount = userInfo.MemberCount;

		// status
		this.isRoomContact =  this.class.isRoomContact(userInfo.UserName);
		this.Statues = userInfo.Statues;
		this.contactFlag = userInfo.ContactFlag;
		
		this.hasPhotoAlbum = !!(1 & userInfo.SnsFlag);

		this.isShieldUser = this.class.isShieldUser(this.UserName);

		this.isBrandContact = !!(userInfo.VerifyFlag & UserAttrVerifyFlag.BIZ_BRAND);
		if(isSelf != undefined) {
			this.isSelf = isSelf;
		}else if(contactManager.account){
			this.isSelf = userInfo.UserName == contactManager.account.UserName;
		}
	}

	

	getDisplayName(){
		let self = this;
		var name = "";

		if(this.isRoomContact) {
			name = this.RemarkName || this.NickName;
			if(!name && !this.MemberCount) {
				this.MemberList.slice(0,10).forEach(membr=>{
					let contactUser = contactManager.getContact(membr.UserName);
					if(contactUser) {
						name += contactUser.RemarkName || contactUser.NickName
					}else{
						name += membr.NickName;
					}
				});
			}else if(!name){
				name = this.UserName;
			}
		}else{
			name = this.RemarkName || this.NickName;
		}

		return name;
	}

	static isSpUser(username:string){
		return /@qqim$/.test(username) || SpicalAccounts.indexOf(username) != -1;
	}

	static isShieldUser(username:string){
		return /@lbsroom$/.test(username) || /@talkroom$/.test(username) || ShieldAccounts.indexOf(username) != -1;
	}

	static isRoomContact(username:string){
		return username ? /^@@|@chatroom$/.test(username) : false;
	}
}