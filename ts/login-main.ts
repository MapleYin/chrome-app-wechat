requirejs.config({
	'baseUrl' : 'app/',
	'urlArgs' : 'bust='+(new Date()).getTime()
});
import {Login} from './controller/login'


new Login();