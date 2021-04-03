// Import
import {
    ItemManager_setItem,
    ItemManager_updateItem,
    ItemManager_addCallback,
    ItemManager_rmCallback,
    ItemManager_getItem, ItemManager_getKeyList
} from "./ItemManager";

import {
    path_log_data,
    filename_log_data_name_list,
    Server_addCallback_LogData,
    Server_rmCallback_LogData
} from "@/utility/Server_Data";
import {getPalette} from "@/utility/Utility";


// Data Structure
class Observer_LogData {
    // data
    id:                     bigint;
    log_data_mapper_table:  any;  // key: id of LogData
    size_max:               bigint;
    size:                   bigint;

    // __init__
    constructor(id: bigint) {
        this.id                     = id;
        this.log_data_mapper_table  = new Map();
        this.size_max               = -1n;
        this.size                   = 0n;
    }

    // function
    Hook_LogData_update(data: any, self: Observer_LogData) {
        if (data == null) return;

        // get hash
        const hash = data.id;

        // add event
        if (!self.log_data_mapper_table.has(hash)) {

            // check if reach the number
			// this check should be done outside
            // if (self.size_max > 0 && self.size >= self.size_max) return;
            self.size++;

            // event
            const item = {
                log_data:   data,
                custom:     self.createDefaultCustomData(data.label),
            };
            self.log_data_mapper_table.set(hash, item);

            ItemManager_setItem(
                _getPath_Observer_AddInterface_(self.id),
                item
            );
            return;
        }

        // config event
        const item = self.log_data_mapper_table.get(hash);
        ItemManager_setItem(
            _getPath_Observer_ConfigInterface_(self.id),
            item
        );
    }

    // TODO
    // addData(id_log_data: any) {
    //
    // }

    rmData(id_log_data: any) {
        // get hash
        const hash = id_log_data;

        // remove from table
        // but first check if the data existed in table or not
        if (!this.log_data_mapper_table.has(hash)) return;

        const data = this.log_data_mapper_table.get(hash);
        this.log_data_mapper_table.delete(hash);

        // event
        ItemManager_setItem(
            _getPath_Observer_RmInterface_(this.id),
            data
        );

        // status
        this.size--;
    }

    // TODO
    Hook_LogData_NameList_update(data: any) {
        if (data == null) return;
    }

    // TODO: move to other place
    createDefaultCustomData(name: string) {
        return  {
            label:          name,
            fill:           false,
            borderWidth:    1,
            rgba_color:     getPalette(null, 0.4, 0.7),
        }
    }
}


// Data
// const observer_table        = new Map();
// const log_data_hook_table   = new Map();

let is_initiated: boolean = false;
let observer_index: bigint = 1n;

const path_observer_log_data            = "Observer/Data/";
const filename_observer_log_data        = "object"
const filename_observer_log_data_add    = "add";
const filename_observer_log_data_rm     = "rm";
const filename_observer_log_data_config = "config";


// Local Function
function _getPath_Observer_(id_observer: bigint) {
    return path_observer_log_data + id_observer + "/" + filename_observer_log_data;
}


function _getPath_Observer_AddInterface_(id_observer: bigint) {
    return path_observer_log_data + id_observer + "/" + filename_observer_log_data_add;
}


function _getPath_Observer_RmInterface_(id_observer: bigint) {
    return path_observer_log_data + id_observer + "/" + filename_observer_log_data_rm;
}


function _getPath_Observer_ConfigInterface_(id_observer: bigint) {
    return path_observer_log_data + id_observer + "/" + filename_observer_log_data_config;
}


function _create_() {
    // create observer
    const id_ = observer_index;
    observer_index++;

    const observer = new Observer_LogData(id_);

    // save to item manager
    ItemManager_setItem(
        _getPath_Observer_(id_),
        observer
    );

    // return id of observer
    return id_;
}


// TODO: need to temp. stop using observer_table, log_data_hook_table when destroying observer
function _destroy_(id_observer: bigint) {
    // TODO
    return false;
}


function _addDataLog_(id_observer: bigint, id_log_data: bigint) {
    // try to get the observer
    const observer: Observer_LogData = ItemManager_getItem(
        _getPath_Observer_(id_observer));
    if (observer == null) return false;

    // check if reach the max bind number
	if (observer.size_max >= 0 && observer.size === observer.size_max) return false;

    // add callback
    const ret = Server_addCallback_LogData(
        id_log_data,
        observer.Hook_LogData_update,
        observer);

    return ret;
}


function _rmDataLog_(id_observer: bigint, id_log_data: bigint) {
    // try to get the observer
    const observer: Observer_LogData = ItemManager_getItem(
        _getPath_Observer_(id_observer));
    if (observer == null) return false;

    // rm callback
    const ret = Server_rmCallback_LogData(
        id_log_data,
        observer.Hook_LogData_update);
    observer.rmData(id_log_data);

    return ret;
}


function _addCallback_Add_(id_observer: bigint, func: any) {
    return ItemManager_addCallback(
        _getPath_Observer_AddInterface_(id_observer),
        func,
        false
    );
}


function _addCallback_Rm_(id_observer: bigint, func: any) {
    return ItemManager_addCallback(
        _getPath_Observer_RmInterface_(id_observer),
        func,
        false
    );
}


function _addCallback_Config_(id_observer: bigint, func: any) {
    return ItemManager_addCallback(
        _getPath_Observer_ConfigInterface_(id_observer),
        func,
        false
    );
}


function _rmCallback_Add_(id_observer: bigint, func: any) {
    return ItemManager_rmCallback(
        _getPath_Observer_AddInterface_(id_observer),
        func
    );
}


function _rmCallback_Rm_(id_observer: bigint, func: any) {
    return ItemManager_rmCallback(
        _getPath_Observer_RmInterface_(id_observer),
        func
    );
}


function _rmCallback_Config_(id_observer: bigint, func: any) {
    return ItemManager_rmCallback(
        _getPath_Observer_ConfigInterface_(id_observer),
        func
    );
}


function _configCustom_(id_observer: bigint, id_log_data: bigint, func: any) {
    // try to get the observer
    const observer: Observer_LogData = ItemManager_getItem(
        _getPath_Observer_(id_observer)
    );
    if (observer == null) return false;

    // try to get custom item
    if (!observer.log_data_mapper_table.has(id_log_data)) return false;
    const data = observer.log_data_mapper_table.get(id_log_data);

    // get custom item
    data.custom = func(data.custom);

    // as the custom data in data (log_data_mapper_table) is changed
    // then need to call the update function
    ItemManager_setItem(
        _getPath_Observer_ConfigInterface_(id_observer),
        data
    );

    return true;
}


function _getData_(id_observer: bigint) {
    // try to get the observer
    const observer: Observer_LogData = ItemManager_getItem(
        _getPath_Observer_(id_observer)
    );
    if (observer == null) return [];

    // get list of data
    const data_list = [];

    for (let [key, value] of observer.log_data_mapper_table) {
        data_list.push(value);
    }

    return data_list;
}


function _setSizeMax_(id_observer: bigint, size_max: bigint) {
    // try to get the observer
    const observer: Observer_LogData = ItemManager_getItem(
        _getPath_Observer_(id_observer)
    );
    if (observer == null) return false;

    // set size max
    observer.size_max = size_max;

    return true;
}


// Export Function
export function Observer_LogData_init() {
    if (is_initiated) return;
    is_initiated = true;
}


export function Observer_LogData_create() {
    return _create_();
}


export function Observer_LogData_destroy(id_observer: bigint) {
    if (id_observer < 0) return false;
    return _destroy_(id_observer);
}


export function Observer_LogData_bindData(id_observer: bigint, id_log_data: bigint) {
    if (id_observer < 0 || id_log_data < 0) return false;
    return _addDataLog_(id_observer, id_log_data);
}


export function Observer_LogData_unbindData(id_observer: bigint, id_log_data: bigint) {
    if (id_observer < 0 || id_log_data < 0) return false;
    return _rmDataLog_(id_observer, id_log_data);
}


export function Observer_LogData_addCallback_Add(id_observer: bigint, func: any) {
    if (id_observer < 0)    return false;
    if (func == null)       return false;
    return _addCallback_Add_(id_observer, func);
}


export function Observer_LogData_addCallback_Rm(id_observer: bigint, func: any) {
    if (id_observer < 0)    return false;
    if (func == null)       return false;
    return _addCallback_Rm_(id_observer, func);
}


export function Observer_LogData_addCallback_Config(id_observer: bigint, func: any) {
    if (id_observer < 0)    return false;
    if (func == null)       return false;
    return _addCallback_Config_(id_observer, func);
}


export function Observer_LogData_rmCallback_Add(id_observer: bigint, func: any) {
    if (id_observer < 0)    return false;
    if (func == null)       return false;
    return _rmCallback_Add_(id_observer, func);
}


export function Observer_LogData_rmCallback_Rm(id_observer: bigint, func: any) {
    if (id_observer < 0)    return false;
    if (func == null)       return false;
    return _rmCallback_Rm_(id_observer, func);
}


export function Observer_LogData_rmCallback_Config(id_observer: bigint, func: any) {
    if (id_observer < 0)    return false;
    if (func == null)       return false;
    return _rmCallback_Config_(id_observer, func);
}


export function Observer_LogData_configCustom(id_observer: bigint, id_log_data: bigint, func: any) {
    if (id_observer < 0 || id_log_data < 0) return false;
    if (func == null)                       return false;
    return _configCustom_(id_observer, id_log_data, func);
}


export function Observer_LogData_getData(id_observer: bigint) {
    if (id_observer < 0)    return false;
    return _getData_(id_observer);
}


export function Observer_LogData_setSizeMax(id_observer: bigint, size_max: bigint) {
    if (id_observer < 0)    return false;
    return _setSizeMax_(id_observer, size_max);
}
