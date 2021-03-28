// Import
import {
	ItemManager_addCallback, ItemManager_rmCallback,
	ItemManager_setItem
} from "@/utility/ItemManager";


// Local Data
let widget_index: 	number 	= 1;
const widget_list:	any[] 	= [];

const path_widget_control		= "Widget/";
const filename_add_widget		= "add";
const filename_rm_widget		= "rm";
const filename_config_widget	= "config";


// Local Function
// ...


// Global Function
export function WidgetControl_addWidget(component: string) {
	// get index
	const id = widget_index;
	widget_index++;

	// create object
	const widget = {
		id: 		id,
		component:	component,
		custom:		{},
	};

	// add to list
	widget_list.push(widget);

	// update
	ItemManager_setItem(path_widget_control + filename_add_widget, widget, true);

	// RET
	return id;
}


export function WidgetControl_rmWidget(id_widget: number) {
	// get index
	const index = widget_list.findIndex(element => element.id === id_widget);
	if (index < 0) return false;

	// remove from list
	const widget = widget_list[index];
	widget_list.splice(index, 1);

	// update
	ItemManager_setItem(path_widget_control + filename_rm_widget, widget, true);

	// RET
	return true;
}


export function WidgetControl_configWidget(id_widget: number, func: any) {
	// get index
	const index = widget_list.findIndex(element => element.id === id_widget);
	if (index < 0) return false;

	// get custom from widget
	const widget = widget_list[index];
	const custom = widget.custom;

	// config
	widget.custom = func(custom);

	// update
	ItemManager_setItem(path_widget_control + filename_config_widget, widget, true);

	// RET
	return true;
}


export function WidgetControl_addCallback_addWidget(callback: any) {
	return ItemManager_addCallback(path_widget_control + filename_add_widget, callback, false);
}


export function WidgetControl_addCallback_rmWidget(callback: any) {
	return ItemManager_addCallback(path_widget_control + filename_rm_widget, callback, false);
}


export function WidgetControl_addCallback_configWidget(callback: any) {
	return ItemManager_addCallback(path_widget_control + filename_config_widget, callback, false);
}


export function WidgetControl_rmCallback_addWidget(callback: any) {
	return ItemManager_rmCallback(path_widget_control + filename_add_widget, callback);
}


export function WidgetControl_rmCallback_rmWidget(callback: any) {
	return ItemManager_rmCallback(path_widget_control + filename_rm_widget, callback)
}


export function WidgetControl_rmCallback_configWidget(callback: any) {
	return ItemManager_rmCallback(path_widget_control + filename_config_widget, callback);
}


export function WidgetControl_getWidgetList() {
	return widget_list;
}
