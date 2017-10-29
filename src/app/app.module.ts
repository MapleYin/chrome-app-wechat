import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {MainComponent} from './main/main.component'
import {ChatListComponent} from './chat-list/chat-list.component'
import {ChatDetailComponent} from './chat-detail/chat-detail.component'

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
