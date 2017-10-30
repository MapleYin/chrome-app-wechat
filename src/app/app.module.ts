import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {MainComponent} from './view/main/main.component'
import {ChatListComponent} from './view/chat-list/chat-list.component'
import {ChatDetailComponent} from './view/chat-detail/chat-detail.component'

@NgModule({
	declarations: [
		MainComponent,
		ChatListComponent,
		ChatDetailComponent
	],
	imports: [
		BrowserModule
	],
	providers: [],
	bootstrap: [MainComponent]
})
export class AppModule { }
