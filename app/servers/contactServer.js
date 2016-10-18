define(["require", "exports", './coreServer', '../models/userModel', '../utility/contactListHelper'], function (require, exports, coreServer_1, userModel_1, contactListHelper_1) {
    "use strict";
    let GET_CONTACT_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxbatchgetcontact';
    let GET_ALL_CONTACT_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxgetcontact';
    let GET_HEAD_IMG = '/cgi-bin/mmwebwx-bin/webwxgetheadimg';
    let GET_ICON = '/cgi-bin/mmwebwx-bin/webwxgeticon';
    class ContactServer extends coreServer_1.CoreServer {
        constructor() {
            super();
            this.host = 'https://wx.qq.com';
            this.getContactErrorCount = 0;
            this.getContactErrorList = [];
            this.getContactGettingList = [];
        }
        checkForSystemMessageOnceForLatestContact(messages) {
            // let sysMessage:Message = messages.find(function(value){
            // 	return value.MsgType == 51;
            // });
            // if(sysMessage) {
            // 	this.getContacts(sysMessage.StatusNotifyUserName.split(','));
            // 	this.didCheckSystemMessage = true;
            // }
        }
        getContactHeadImgUrl(params) {
            let url = userModel_1.UserModel.isRoomContact(params.UserName) ? GET_HEAD_IMG : GET_ICON;
            let msgIdQuery = params.MsgId ? `&msgid=${params.MsgId}` : '';
            let chatroomIdQuery = params.EncryChatRoomId ? `&chatroomid=${params.EncryChatRoomId}` : '';
            return `${url}?seq=0&username=${params.UserName}&skey=${this.class.Skey}${msgIdQuery}${chatroomIdQuery}`;
        }
        batchGetContact(getContactList) {
            let self = this;
            let errorCount = this.getContactErrorList.length;
            var getErrorCount = 0;
            if (errorCount) {
                if (errorCount < 6 || this.getContactErrorCount > 2) {
                    getErrorCount = 1;
                }
                else if (errorCount < 40) {
                    getErrorCount = 5;
                }
                else {
                    getErrorCount - 10;
                }
                this.getContactGettingList = this.getContactErrorList.splice(0, getErrorCount);
            }
            else {
                this.getContactGettingList = getContactList.splice(0, 50);
            }
            return this.commonJsonPost(GET_CONTACT_URL, {
                type: 'ex',
                r: this.getTimeStamp(),
                lang: 'zh_CN',
                pass_ticket: this.class.passTicket
            }, {
                Count: this.getContactGettingList.length,
                List: this.getContactGettingList
            }).then((response) => {
                return response.json().then((result) => {
                    if (result.BaseResponse.Ret == 0) {
                        self.getContactGettingList = [];
                        self.getContactErrorCount = 0;
                        return result.ContactList;
                    }
                    else {
                        throw result;
                    }
                });
            }).catch(reson => {
                self.getContactErrorCount++;
                let gettingList = self.getContactGettingList;
                self.getContactGettingList = [];
                gettingList.forEach(userParams => {
                    if (contactListHelper_1.ContactInListIndex(self.getContactErrorList, userParams) == -1) {
                        self.getContactErrorList.push(userParams);
                        let index = contactListHelper_1.ContactInListIndex(getContactList, userParams);
                        if (index > -1) {
                            getContactList.splice(index, 1);
                        }
                    }
                });
                return reson;
            });
        }
        getImage(urlString) {
            return this.get(urlString, null, {
                responseType: 'blob'
            }).then((response) => {
                response.blob().then((data) => {
                    let objURL = URL.createObjectURL(data);
                    return objURL;
                });
            });
        }
        getAllContacts(seq) {
            let self = this;
            return this.get(GET_ALL_CONTACT_URL, {
                lang: 'zh_CN',
                pass_ticket: this.class.passTicket,
                r: this.getTimeStamp(),
                seq: seq,
                skey: this.class.Skey
            }).then((response) => {
                return response.json().then((result) => {
                    if (result.BaseResponse.Ret == 0) {
                        console.log('Get All Contact');
                        return result;
                    }
                    else {
                        throw result.BaseResponse;
                    }
                });
            });
        }
    }
    exports.contactServer = new ContactServer();
});
