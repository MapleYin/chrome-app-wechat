import { Injectable } from '@angular/core';

import {CoreService} from './core.service'

import {IUser} from '../interface/user.interface'
import {IBatchgetContactParams,IContactResponse,IBatchContactResponse} from '../interface/network.interface'


const GET_CONTACT_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxbatchgetcontact';
const GET_ALL_CONTACT_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxgetcontact';


const ContactInListIndex = (list:IBatchgetContactParams[],params:IBatchgetContactParams)=>{
	return list.findIndex(value=>{
		return value.UserName == params.UserName;
	});
};

@Injectable()
export class AccountService {

	private getContactErrorCount:number = 0;
	private getContactErrorList:IBatchgetContactParams[] = [];
	private getContactGettingList:IBatchgetContactParams[] = [];

	constructor(private coreService:CoreService) {
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

		return this.coreService.commonJsonPost(GET_CONTACT_URL,{
			type : 'ex',
			r : this.coreService.getTimeStamp(),
			lang : 'zh_CN',
			pass_ticket : this.coreService.passTicket
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

		return this.coreService.get(GET_ALL_CONTACT_URL,{
			lang : 'zh_CN',
			pass_ticket : this.coreService.passTicket,
			r : this.coreService.getTimeStamp(),
			seq : seq,
			skey : this.coreService.Skey
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