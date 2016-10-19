export interface fetchParams{
	url : string;
	method?: 'GET'|'POST';
	headers?: {[key:string]:string};
	query?: {[key:string]:string};
	body?: {[key:string]:string}|string;
}

export interface fetchResult{
	status : number;
	message : string;
	data : any;
}