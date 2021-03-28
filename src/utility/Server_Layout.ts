// Import
import axios, { AxiosRequestConfig } from "axios";
import {
	ItemManager_setItem,
	ItemManager_updateItem,
	ItemManager_addCallback,
	ItemManager_rmCallback
} from "./ItemManager";


// Local Data
let server_address 	= "http://localhost:8002";
let is_initiated	= false;

const path_layout			= "Server/Layout/";
const path_status			= "Status/";
const filename_data			= "data";
const filename_get_layout	= "get_layout";
const filename_set_layout 	= "set_layout";

const STATUS_NONE			= 0;
const STATUS_ONGOING		= 1;
const STATUS_SUCCESS		= 2;
const STATUS_FAIL		 	= 3;


// Local Function
function _request_(config: AxiosRequestConfig) {
	// create instance
	const instance = axios.create({
		baseURL: server_address,
		timeout: 5000
	});

	// return instance
	return instance(config);
}


function _request_GetLayout_() {
	// create request
	const instance = _request_({
		url: "/GetLayout",
		method: "GET",
	});

	// status event
	ItemManager_setItem(path_layout + path_status + filename_get_layout, STATUS_ONGOING, true);

	// get data
	instance.then(res => {
		ItemManager_setItem(path_layout + filename_data, res.data, true);
		ItemManager_setItem(path_layout + path_status + filename_get_layout, STATUS_SUCCESS, true);
	}).catch(res => {
		ItemManager_setItem(path_layout + path_status + filename_get_layout, STATUS_FAIL, true);
	});
}


function _request_SetLayout_(data: any) {
	// create request
	const instance = _request_({
		url: "/SetLayout",
		method: "POST",
		params: {
			data: data
		}
	});

	// status event
	ItemManager_setItem(path_layout + path_status + filename_set_layout, STATUS_ONGOING, true);

	// get data
	instance.then(res => {
		ItemManager_setItem(path_layout + path_status + filename_set_layout, STATUS_SUCCESS, true);
	}).catch(res => {
		ItemManager_setItem(path_layout + path_status + filename_set_layout, STATUS_FAIL, true);
	});
}


// Global Function
// init
export function Server_Layout_init() {
	if (is_initiated) return;
	is_initiated = true;
}


// operation, update
export function Server_Layout_updateLayout(is_request: boolean = true) {
	if (is_request) _request_GetLayout_();
	else			ItemManager_updateItem(path_layout + filename_data);
}


// TODO: need to jsonify the layout_list
export function Server_Layout_setLayout(layout_list: any[]) {
	// _request_SetLayout_(layout_list);
}


// add callback
export function Server_Layout_Data_addCallback(callback: any) {
	ItemManager_addCallback(path_layout + filename_data, callback);
}


export function Server_Layout_Status_GetLayout_addCallback(callback: any) {
	ItemManager_addCallback(path_layout + path_status + filename_get_layout, callback, false);
}


export function Server_Layout_Status_SetLayout_addCallback(callback: any) {
	ItemManager_addCallback(path_layout + path_status + filename_set_layout, callback, false);
}


// rm callback
export function Server_Layout_Data_rmCallback(callback: any) {
	ItemManager_rmCallback(path_layout + filename_data, callback);
}


export function Server_Layout_Status_GetLayout_rmCallback(callback: any) {
	ItemManager_rmCallback(path_layout + path_status + filename_get_layout, callback);
}


export function Server_Layout_Status_SetLayout_rmCallback(callback: any) {
	ItemManager_rmCallback(path_layout + path_status + filename_set_layout, callback);
}


// getter, setter
export function Server_Layout_getAddress() {
	return server_address;
}


export function Server_Layout_setAddress(address: string) {
	server_address = address;
	Server_Layout_updateLayout();
}
