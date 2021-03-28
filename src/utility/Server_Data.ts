// Import
import axios, { AxiosRequestConfig } from "axios";
import {
    ItemManager_setItem,
    ItemManager_updateItem,
    ItemManager_addCallback,
    ItemManager_rmCallback
} from "./ItemManager";


// Local Data
let server_address  = "http://localhost:8001"
let is_initiated    = false;

const path_log_data                  = "Server/Data/LogData/";
const filename_log_data_name_list    = "Server/Data/log_data_name_list";

const id_map = new Map();


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


function request_GetList_LogData_Name() {
    // create request
    const instance = _request_({
        url: "/GetList_LogData_Name",
        method: "GET",
    });

    // get data
    instance.then(res => {
        ItemManager_setItem(filename_log_data_name_list, res.data, true);
    }).catch(res => {
    });
}


function request_GetList_LogData_Changed() {
    // create request
    const instance = _request_({
        url: "/GetList_LogData_Changed",
        method: "GET"
    });

    // get data
    instance.then(res => {

        // update log_data based on change_list
        for (let i = 0; i < res.data.length; ++i) {
            const id_ = res.data[i];
            if (!id_map.has(id_)) continue;
            request_GetLog_Data(id_);
        }

    }).catch(res => {
    });
}


function request_AddLog_Data(data_list: any, data_type: bigint, name: string) {
    // create request
    const instance = _request_({
        url: "/AddLog_Data",
        method: "POST",
        params: {
            data: JSON.stringify(data_list),
            type: data_type,
            name: name,
        }
    });

    // get data
    instance.then(res => {
        request_GetList_LogData_Name();
    }).catch(res => {
    });
}


function request_RmLog_Data(id_: bigint) {
    // create request
    const instance = _request_({
        url: "/RmLog_Data",
        method: "POST",
        params: {
            id: id_
        }
    });

    // get data
    instance.then(res => {
        request_GetList_LogData_Name();
    }).catch(res => {
    });
}


function request_GetLog_Data(id_: bigint) {
    // create request
    const instance = _request_({
        url: "/GetLog_Data",
        method: "POST",
        params: {
            id: id_
        }
    });

    // get data
    instance.then(res => {
        const data = {
            id:     res.data[0],
            label:  res.data[1],
            data:   res.data[2],
            type:   res.data[3]
        };

        // register the id
        id_map.set(data.id, null);

        // update event
        ItemManager_setItem(path_log_data + id_, data);
    }).catch(res => {
    });
}


// Global Function
// TODO: rename: Server_Data_XXX
// init
export function Server_init() {
    if (is_initiated) return;
    is_initiated = true;
}


// add callback
export function Server_addCallback_IDNameList(callback: any) {
    ItemManager_addCallback(filename_log_data_name_list, callback);
}


export function Server_addCallback_LogData(id: bigint, callback: any, data: any = null) {
    if (!id_map.has(id)) request_GetLog_Data(id);
    ItemManager_addCallback(path_log_data + id, callback, true, data);
}


// rm callback
export function Server_rmCallback_IDNameList(callback: any) {
    ItemManager_rmCallback(filename_log_data_name_list, callback);
}


export function Server_rmCallback_LogData(id: bigint, callback: any) {
    ItemManager_rmCallback(path_log_data + id, callback);
}


// update
export function Server_update_IDNameList(is_request: boolean = true) {
    if (is_request) request_GetList_LogData_Name();
    else            ItemManager_updateItem(filename_log_data_name_list);
}


export function Server_update() {
    request_GetList_LogData_Changed();
}


// getter
export function Server_getAddress() {
    return server_address;
}


export function Server_setAddress(address: string) {
    server_address = address;
}


// data
export {
    path_log_data,
    filename_log_data_name_list
};
