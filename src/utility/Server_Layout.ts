// Import
import axios, { AxiosRequestConfig } from "axios";
import {
	ItemManager_setItem,
	ItemManager_updateItem,
	ItemManager_addCallback,
	ItemManager_rmCallback
} from "./ItemManager";


// Local Data
let server_address 	= "http://localhost:8001";
let is_initiated	= false;

const path_layout			= "Server/Layout/";
const path_data				= "Data/";
const path_event			= "Event/";

const filename_id_list		= "id_list";
const filename_init			= "init";
const filename_add			= "add";
const filename_rm			= "rm";
const filename_config		= "config";

const LABEL_ID:			string = "0"
const LABEL_GEOMETRY:	string = "1"
const LABEL_NAME:		string = "2"
const LABEL_COMPONENT:	string = "3"
const LABEL_STATE:		string = "4"
const LABEL_CUSTOM:		string = "5"
const LABEL_SIZE_MAX:	string = "6"


// Local Function
// object convention
// convert widget object to readable format
function _convertWidgetObject_(data: any) {
	return {
		id:			data[LABEL_ID],
		x:			data[LABEL_GEOMETRY][0],
		y:			data[LABEL_GEOMETRY][1],
		w:			data[LABEL_GEOMETRY][2],
		h:			data[LABEL_GEOMETRY][3],
		name:		data[LABEL_NAME],
		component:	data[LABEL_COMPONENT],
		state:		data[LABEL_STATE],
		custom:		data[LABEL_CUSTOM]
	};
}


// server
function _request_(config: AxiosRequestConfig) {
	// create instance
	const instance = axios.create({
		baseURL: server_address,
		timeout: 5000
	});

	// return instance
	return instance(config);
}


function _request_GetList_LogWidget_ID_() {
	// create request
	const instance = _request_({
		url: "/GetList_LogWidget_ID",
		method: "GET",
	});

	// get data
	instance.then(res => {
		ItemManager_setItem(path_layout + filename_id_list, res.data, true);
	}).catch(res => {
	});
}


function _request_GetLog_Widget_(id: bigint, filename: any = null) {
	// create request
	const instance = _request_({
		url: "/GetLog_Widget",
		method: "POST",
		params: {
			id: id
		}
	});

	// get data
	instance.then(res => {
		// to object from json
		const widget = _convertWidgetObject_(res.data);

		// update item
		// ItemManager_setItem(path_layout + path_data + id, widget, true);

		// update event
		if (filename == null) filename = filename_config;
		ItemManager_setItem(path_layout + path_event + filename, widget, true);

	}).catch(res => {
	});
}


function _request_AddLog_Widget_(component: string) {
	// create request
	const instance = _request_({
		url: "/AddLog_Widget",
		method: "POST",
		params: {
			component: component
		}
	});
	
	// get data
	instance.then(res => {
		_request_GetLog_Widget_(res.data["id"], filename_add);
	}).catch(res => {
	});
}


function _request_RmLog_Widget_(id: bigint) {
	// create request
	const instance = _request_({
		url: "/RmLog_Widget",
		method: "POST",
		params: {
			id: id,
		}
	});

	// get data
	instance.then(res => {
		if (!res.data.return) return;
		ItemManager_setItem(path_layout + path_event + filename_rm, id);
	}).catch(res => {
	});
}


function _request_ConfigLog_Widget_(widget: any) {
	// create request
	const instance = _request_({
		url: "/ConfigLog_Widget",
		method: "POST",
		params: {
			id: 		widget.id,
			geometry:	[widget.x, widget.y, widget.w, widget.h],
			name:		widget.name,
			component:	widget.component,
			state:		JSON.stringify(widget.state),
			custom:		JSON.stringify(widget.custom)
		}
	});

	// get data
	instance.then(res => {
		if (!res.data.return) return;
		_request_GetLog_Widget_(widget.id, filename_config);
	}).catch(res => {
	});
}


// Global Function
// init
export function Server_Layout_init() {
	if (is_initiated) return;
	is_initiated = true;
}


// operation, update
export function Server_Layout_updateWidgetIDList() {
	_request_GetList_LogWidget_ID_();
}


export function Server_Layout_updateWidget(id: bigint) {
	_request_GetLog_Widget_(id);
}


export function Server_Layout_addWidget(component: string) {
	_request_AddLog_Widget_(component);
}


export function Server_Layout_rmWidget(id: bigint) {
	_request_RmLog_Widget_(id);
}


export function Server_Layout_configWidget(widget: any) {
	_request_ConfigLog_Widget_(widget);
}


// add callback
export function Server_Layout_addCallback_WidgetIDList(callback: any) {
	return ItemManager_addCallback(path_layout + filename_id_list, callback, false);
}


export function Server_Layout_addCallback_AddWidget(callback: any) {
	return ItemManager_addCallback(path_layout + path_event + filename_add, callback, false);
}


export function Server_Layout_addCallback_RmWidget(callback: any) {
	return ItemManager_addCallback(path_layout + path_event + filename_rm, callback, false);
}


export function Server_Layout_addCallback_ConfigWidget(callback: any) {
	return ItemManager_addCallback(path_layout + path_event + filename_config, callback, false);
}


// rm callback
export function Server_Layout_rmCallback_WidgetIDList(callback: any) {
	return ItemManager_rmCallback(path_layout + filename_id_list, callback);
}


export function Server_Layout_rmCallback_AddWidget(callback: any) {
	return ItemManager_rmCallback(path_layout + path_event + filename_add, callback);
}


export function Server_Layout_rmCallback_RmWidget(callback: any) {
	return ItemManager_rmCallback(path_layout + path_event + filename_rm, callback);
}


export function Server_Layout_rmCallback_ConfigWidget(callback: any) {
	return ItemManager_rmCallback(path_layout + path_event + filename_config, callback);
}


// getter, setter
// ...
