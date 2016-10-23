import {IUser,IMessage,IBaseResponse,IBatchContactResponse,IContactResponse,IContactHeadImgParams,IBatchgetContactParams} from '../models/wxInterface'
import {CoreServer} from './coreServer'
import {UserModel} from '../models/userModel'
import {ContactInListIndex} from '../utility/contactListHelper'

let GET_CONTACT_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxbatchgetcontact';
let GET_ALL_CONTACT_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxgetcontact';

class ContactServer extends CoreServer{

	private getContactErrorCount:number = 0;
	private getContactErrorList:IBatchgetContactParams[] = [];
	private getContactGettingList:IBatchgetContactParams[] = [];

	constructor(){
		super();
	}

	batchGetContact(getContactList:IBatchgetContactParams[]):Promise<IUser[]>{
		let self = this;

		let errorCount = this.getContactErrorList.length;
		var getErrorCount = 0;

		if(errorCount) {
			if(errorCount < 6 || this.getContactErrorCount > 2) {
				getErrorCount = 1;
			}else if(errorCount < 40){
				getErrorCount = 5
			}else{
				getErrorCount - 10;
			}
			this.getContactGettingList = this.getContactErrorList.splice(0,getErrorCount);
		}else{
			this.getContactGettingList = getContactList.splice(0,50);
		}

		return this.commonJsonPost(GET_CONTACT_URL,{
			type : 'ex',
			r : this.getTimeStamp(),
			lang : 'zh_CN',
			pass_ticket : this.class.passTicket
		},{
			Count : this.getContactGettingList.length,
			List : this.getContactGettingList
		}).then((response:Response)=>{
			return response.json().then((result:IBatchContactResponse)=>{
				if(result.BaseResponse.Ret == 0) {
					self.getContactGettingList = [];
					self.getContactErrorCount = 0;
					return result.ContactList;
				}else{
					throw result;
				}
			});
		}).catch(reson=>{
			self.getContactErrorCount++;
			let gettingList = self.getContactGettingList;
			self.getContactGettingList = [];
			gettingList.forEach(userParams=>{
				if(ContactInListIndex(self.getContactErrorList,userParams) == -1){
					self.getContactErrorList.push(userParams);
					let index = ContactInListIndex(getContactList,userParams);
					if(index > -1) {
						getContactList.splice(index,1);
					}
				}
			});
			return reson;
		});
	}

	getAllContacts(seq:number):Promise<IContactResponse>{
		let self = this;

		return this.get(GET_ALL_CONTACT_URL,{
			lang : 'zh_CN',
			pass_ticket : this.class.passTicket,
			r : this.getTimeStamp(),
			seq : seq,
			skey : this.class.Skey
		}).then((response:Response)=>{
			return response.json().then((result:IContactResponse)=>{
				if(result.BaseResponse.Ret == 0) {
					console.log('Get All Contact');
					return result;
				}else{
					throw result.BaseResponse;
					
				}
			})
		});
	}
}

export let contactServer = new ContactServer();