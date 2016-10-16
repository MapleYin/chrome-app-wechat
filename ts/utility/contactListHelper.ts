import {IBatchgetContactParams} from '../models/wxInterface'

export let ContactInListIndex = (list:IBatchgetContactParams[],params:IBatchgetContactParams)=>{
	return list.findIndex(value=>{
		return value.UserName == params.UserName;
	});
};