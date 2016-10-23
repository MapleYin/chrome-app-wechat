import {MessageModel} from '../models/messageModel'
import {MessageType} from '../models/wxInterface'
import {BaseManager} from './baseManager'
import {contactManager} from './contactManager'
import {NotificationCenter} from '../utility/notificationCenter'
import {sourceServer} from '../servers/sourceServer'
class NotificationManager extends BaseManager{

	constructor(){
		super();
		chrome.notifications.onClicked.addListener(msgID=>{
			this.notificationClicked(msgID);
		});
	}

	post(message:MessageModel,disappear?:number){
		let noticeID = message.MsgId.toString();
		let noticeOptions = this.createOption(message);
		disappear = disappear || 3000;
		sourceServer.fetchSource(noticeOptions.iconUrl).then(localUrl=>{
			noticeOptions.iconUrl = localUrl;
			chrome.notifications.create(noticeID,noticeOptions,noticeID=>{
				setTimeout(()=>{
					chrome.notifications.clear(noticeID);
				},disappear);
			});
		});
	}

	private createOption(message:MessageModel):chrome.notifications.NotificationOptions{
		var option:chrome.notifications.NotificationOptions = {};
		let user = contactManager.getContact(message.MMPeerUserName);
		option.type = 'basic';
		option.title = user.getDisplayName();
		option.iconUrl =  user.HeadImgUrl;
		option.message = message.MMDigest;
		// switch (message.MsgType) {
		// 	case MessageType.TEXT:
		// 		option.message = message.MMDigest;
		// 		break;
		// 	case MessageType.IMAGE:
		// 		option.imageUrl = message.ImageUrl;
		// 		break;
		// 	default:
		// 		// code...
		// 		break;
		// }
		return option;
	}

	private notificationClicked(msgID:string){
		NotificationCenter.post<number>('notification.click',+msgID);
	}
}
export let notificationManager = new NotificationManager();