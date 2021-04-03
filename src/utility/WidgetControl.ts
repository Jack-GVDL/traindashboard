// Import
import {
	ItemManager_addCallback,
	ItemManager_getCallback,
	ItemManager_getKeyList,
	ItemManager_getState,
	ItemManager_rmCallback,
	ItemManager_setItem,
	ItemManager_updateItem
} from "@/utility/ItemManager";
import {
	Server_Layout_addCallback_AddWidget,
	Server_Layout_addCallback_ConfigWidget,
	Server_Layout_addCallback_RmWidget, Server_Layout_addCallback_WidgetIDList,
	Server_Layout_addWidget,
	Server_Layout_configWidget,
	Server_Layout_rmWidget,
	Server_Layout_updateWidgetIDList,
	Server_Layout_updateWidget
} from "@/utility/Server_Layout";


// Local Data
let is_initiated = false;

const widget_list:	any[] 	= [];

const path_widget_control		= "Widget/";
const path_widget_data			= "Data/";

const filename_add_widget		= "add";
const filename_rm_widget		= "rm";
const filename_config_widget	= "config";
const filename_init_widget		= "init";

const filename_update			= "update";
const filename_refresh			= "refresh";


// Local Function
function _getPath_Widget_(id_widget: bigint) {
	return path_widget_control + path_widget_data + id_widget + "/";
}


function _Hook_addWidget_(data: any) {
	if (data == null) return;

	// call init hook
	// it is the immediate action that require immediate return from the callback
	//
	// after this operation
	// it is assumed that widget is ready and add_widget event can be called

	// init event
	ItemManager_setItem(
		path_widget_control + filename_init_widget, data,
		true, true
	);

	// add to list
	widget_list.push(data);

	// add event
	ItemManager_setItem(path_widget_control + filename_add_widget, data);
	ItemManager_setItem(_getPath_Widget_(data.id) + filename_update, data);
}


function _Hook_rmWidget_(id: any) {
	if (id == null) return;

	// remove widget from widget_list
	const index = widget_list.findIndex(element => element.id === id);
	if (index < 0) return;

	const widget = widget_list[index];
	widget_list.splice(index, 1);

	// event
	ItemManager_setItem(path_widget_control + filename_rm_widget, widget, true);
}


function _Hook_configWidget_(widget: any) {
	if (widget == null) return;

	// check if widget existed in widget_list
	// if not existed, treat this widget as new widget
	const index = widget_list.findIndex(element => element.id === widget.id);
	if (index < 0) {
		_Hook_addWidget_(widget);
		return;
	}

	// event
	ItemManager_setItem(
		path_widget_control + filename_config_widget, widget,
		true
	);

	ItemManager_setItem(
		_getPath_Widget_(widget.id) + filename_update, widget,
		true
	);
}


function _Hook_updateWidgetIDList_(id_list: any) {
	for (let id of id_list) Server_Layout_updateWidget(id);
}


// Global Function
// init
export function WidgetControl_init() {
	if (is_initiated) return;
	is_initiated = true;

	Server_Layout_addCallback_AddWidget(_Hook_addWidget_);
	Server_Layout_addCallback_RmWidget(_Hook_rmWidget_);
	Server_Layout_addCallback_ConfigWidget(_Hook_configWidget_);
	Server_Layout_addCallback_WidgetIDList(_Hook_updateWidgetIDList_);
}


// operation
export function WidgetControl_addWidget(component: string) {
	// create widget
	Server_Layout_addWidget(component);
}


export function WidgetControl_rmWidget(id_widget: bigint) {
	Server_Layout_rmWidget(id_widget);
}


export function WidgetControl_configWidget(id_widget: number, func: any) {
	// get widget
	const index = widget_list.findIndex(element => element.id === id_widget);
	if (index < 0) return;

	const widget = widget_list[index];

	// config
	func(widget);

	// update
	Server_Layout_configWidget(widget);
}


export function WidgetControl_updateWidget(id_widget: bigint, is_request: boolean = false) {
	if (is_request) Server_Layout_updateWidget(id_widget);
	else			ItemManager_updateItem(_getPath_Widget_(id_widget) + filename_update);
}


export function WidgetControl_updateAll(is_request: boolean = false) {
	// need to request from server
	if (is_request) {

		for (let widget of widget_list) Server_Layout_updateWidget(widget.id);
		return;
	}

	// update without request from server
	for (let widget of widget_list) {
		ItemManager_setItem(
			path_widget_control + filename_config_widget,
			widget,
		);
	}
}


// get data from server
export function WidgetControl_pull() {
	// get list of widget
	// foreach widget in the list, do updating
	Server_Layout_updateWidgetIDList();
}


// save data to server
export function WidgetControl_push() {
	for (let widget of widget_list) {
		ItemManager_setItem(
			path_widget_control + filename_refresh, widget,
			true, true
		);

		ItemManager_setItem(
			path_widget_control + path_widget_data + widget.id + "/" + filename_refresh, widget,
			true, true
		);
		Server_Layout_configWidget(widget);
	}
}


// callback
//
// add callback
//
// diff. between init widget and add widget
//
// init widget
// widget is not ready, only modification on the widget is allowed
// widget should not be used at this stage
///
// add widget
// widget is ready and can be used
export function WidgetControl_addCallback_InitWidget(callback: any) {
	return ItemManager_addCallback(path_widget_control + filename_init_widget, callback, false);
}


export function WidgetControl_addCallback_AddWidget(callback: any) {
	return ItemManager_addCallback(path_widget_control + filename_add_widget, callback, false);
}


export function WidgetControl_addCallback_RmWidget(callback: any) {
	return ItemManager_addCallback(path_widget_control + filename_rm_widget, callback, false);
}


export function WidgetControl_addCallback_ConfigWidget(callback: any) {
	return ItemManager_addCallback(path_widget_control + filename_config_widget, callback, false);
}


export function WidgetControl_addCallback_RefreshWidget(callback: any) {
	return ItemManager_addCallback(path_widget_control + filename_refresh, callback, false);
}


export function WidgetControl_addCallback_ConfigWidget_Single(id_widget: bigint, callback: any) {
	return ItemManager_addCallback(
		_getPath_Widget_(id_widget) + filename_update,
		callback, false);
}


export function WidgetControl_addCallback_RefreshWidget_Single(id_widget: bigint, callback: any) {
	return ItemManager_addCallback(
		_getPath_Widget_(id_widget) + filename_refresh,
		callback, false);
}


// rm callback
export function WidgetControl_rmCallback_InitWidget(callback: any) {
	return ItemManager_rmCallback(path_widget_control + filename_init_widget, callback);
}


export function WidgetControl_rmCallback_AddWidget(callback: any) {
	return ItemManager_rmCallback(path_widget_control + filename_add_widget, callback);
}


export function WidgetControl_rmCallback_RmWidget(callback: any) {
	return ItemManager_rmCallback(path_widget_control + filename_rm_widget, callback)
}


export function WidgetControl_rmCallback_ConfigWidget(callback: any) {
	return ItemManager_rmCallback(path_widget_control + filename_config_widget, callback);
}


export function WidgetControl_rmCallback_RefreshWidget(callback: any) {
	return ItemManager_rmCallback(path_widget_control + filename_refresh, callback);
}


export function WidgetControl_rmCallback_UpdateWidget_Single(id_widget: bigint, callback: any) {
	return ItemManager_rmCallback(
		_getPath_Widget_(id_widget) + filename_update,
		callback);
}


export function WidgetControl_rmCallback_RefreshWidget_Single(id_widget: bigint, callback: any) {
	return ItemManager_rmCallback(
		_getPath_Widget_(id_widget) + filename_refresh,
		callback);
}


// getter
export function WidgetControl_getWidgetList() {
	return widget_list;
}
