import {
	BaseServer,
	ResponseArrayInfo,
	ResponseObject,
	ResponseArray,
	StatusCode
} from './baseServer';

import {PostMessageManager} from '../tools/postMessageManager'


export class UserServer extends BaseServer{
	private $sandbox:HTMLIFrameElement = $('#sandbox')[0] as HTMLIFrameElement;
	private postMessageManager = new PostMessageManager(this.$sandbox);
	constructor(){
		super();
	}
}