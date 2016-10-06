requirejs.config({
	'baseUrl' : 'app/',
	'urlArgs' : 'bust='+(new Date()).getTime()
});
import {Sandbox} from './tools/sandbox'


new Sandbox();