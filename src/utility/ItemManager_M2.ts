// Import
// ...


// Data Structure
class ItemManager_Callback {
	// data
	callback: 		any;
	data:			any;

	// function
	constructor(callback: any, data: any) {
		this.callback 		= callback;
		this.data	  		= data;
	}

	execute() {
		this.callback(this.data);
	}
}


class ItemManager_Item {
	// data
	callback_list:	ItemManager_Callback[];
	cache:			any;	// target item
	flag:			bigint	= 0n;

	is_updating:	boolean	= false;
	is_blocked:		boolean	= false;
	delay_count:	bigint  = 0n;

	// function
	constructor() {
		this.callback_list 	= [];
		this.cache			= null;
	}

	addCallback(callback: any, data: any) {
		// check if callback exist or not
		// if exist, then change data only
		const index = this.callback_list.findIndex(element => element.callback === callback);
		if (index >= 0) {
			this.callback_list[index].data= data;
			return true;
		}

		this.callback_list.push(new ItemManager_Callback(callback, data));
		return true;
	}

	rmCallback(callback: any) {
		const index = this.callback_list.findIndex(element => element.callback === callback);
		if (index < 0) return false;

		this.callback_list.splice(index, 1);
		return true;
	}

	update() {
		// prevent recursion
		if (this.is_updating) return;
		this.is_updating = true;

		// invoke callback
		for (const callback of this.callback_list) {
			callback.callback(this.cache, callback.data);
		}

		this.is_updating = false;
	}
}


// Local Data
const item_table 	= new Map();

let lock_depth 			= 0;  	// lock_depth
let lock_depth_limit	= 10;

// delay operation
let delay_time			= 200;  // default: 200ms

// 0: delay operation is execution once current update event is finished
// 1: delay operation is called by timer
let delay_mode			= 0;
let delay_loop_limit	= 5;

const delay_update_a:		any[] 	= [];  	// list of ItemManager_Callback, not map cause need the order
const delay_update_b:		any[]	= [];
const delay_update_buffer: 	any[]	= [delay_update_a, delay_update_b];
let delay_update_cur				= 0;

// debug
const hook_update_pre_list: 	any[] = [];
const hook_update_post_list:	any[] = [];


// Local Function
// this is used for delay operation
function _DelayOperation_rmItem_(name: any) {
	if (name == null) return;
	item_table.delete(name);
}


function _DelayOperation_updateItem_(name: any) {
	if (name == null) return;

	// assumed: item must be existed in the table
	const item: ItemManager_Item = item_table.get(name);
	_update_(item);
	item.delay_count--;
}


function _DelayOperation_updateItem_Single_(data: any) {
	if (data == null) return;

	// data: [name, callback, data]
	// assumed: item must be existed in the table
	const item: ItemManager_Item = item_table.get(data[0]);
	data[1](item.cache, data[2]);
}


function _DelayOperation_setItem_(data: any) {
	if (data == null) return;

	// data: [name, new_value]
	// assumed: item must be existed in the table
	const item: ItemManager_Item = item_table.get(data[0]);
	item.cache = data[1];
}


function _DelayOperation_addCallback_(data: any) {
	if (data == null) return;

	// data: [name, callback, data]
	// assumed: item must be existed in the table
	const item: ItemManager_Item = item_table.get(data[0]);
	item.addCallback(data[1], data[2]);
}


function _DelayOperation_rmCallback_(data: any) {
	if (data == null) return;

	// data: [name, callback, data]
	// assumed: item must be existed in the table
	const item: ItemManager_Item = item_table.get(data[0]);
	item.rmCallback(data[1]);
}


function _DelayOperation_clearCallback_(name: any) {
	if (name == null) return;

	// data: [name, callback, data]
	// assumed: item must be existed in the table
	const item: ItemManager_Item = item_table.get(name);
	item.callback_list.splice(0, item.callback_list.length);
}


// currently the hash is just the string itself
// function _getHash_(name: string) {
// 	return name;
// }


function _addItem_(name: string) {
	// check if the hash exist or not
	if (item_table.has(name)) return false;

	// actual add
	const item = new ItemManager_Item();
	item_table.set(name, item);
	return true;
}


function _rmItem_(name: string) {
	// check if the hash exist or not
	if (!item_table.has(name)) return false;

	// actual remove
	// if is updating or update event is scheduled
	// then delay the remove operation
	const item: ItemManager_Item = item_table.get(name);

	if (lock_depth === 0 && item.delay_count === 0n) {
		item_table.delete(name);

	} else {

		// mark the item as "dying", it cannot be updated anymore
		item.is_blocked = true;

		const delay_update = delay_update_buffer[delay_update_cur];
		delay_update.push(new ItemManager_Callback(_DelayOperation_rmItem_, name));
	}
	return true;
}


function _setItem_(name: string, data: any, is_invoke: boolean, is_immediate: boolean) {
	// get item
	if (!item_table.has(name)) return false;
	const item: ItemManager_Item = item_table.get(name);

	// check if item is dying
	if (item.is_blocked) return false;

	// set item
	// allow config data if item is pending for update (delay state)
	// but not allow config data if item is already updating (calling callback)
	//
	// if item is updating
	// delay the set item operation
	if (item.is_updating) {
		const delay_update = delay_update_buffer[delay_update_cur];
		delay_update.push(new ItemManager_Callback(_DelayOperation_setItem_, [name, data]));
		if (is_invoke) delay_update.push(new ItemManager_Callback(_DelayOperation_setItem_, name));
		return;
	}

	item.cache = data;
	if (is_invoke) _updateItem_(name, is_immediate);
}


function _getItem_(name: string) {
	// get item
	if (!item_table.has(name)) return null;
	return item_table.get(name).cache;
}


// the core part of update event
function _update_(item: ItemManager_Item) {
	// debug
	for (let callback of hook_update_pre_list) {
		callback(item);
	}

	// actual update
	item.update();

	// debug
	for (let callback of hook_update_post_list) {
		callback(item);
	}
}


function _updateItem_(name: string, is_immediate: boolean) {
	// check if the hash exist or not
	if (!item_table.has(name)) return false;

	// get item and verify the item can be updated or not
	const item: ItemManager_Item = item_table.get(name);
	if (item.is_blocked) return false;

	// check if can update immediately
	// is_immediate can bypass the lock restriction (unless lock_depth reach the limit)
	if (is_immediate && lock_depth < lock_depth_limit) {

		lock_depth++;
		_update_(item);
		lock_depth--;

		if (delay_mode === 0) _executeDelayed_();
		return true;
	}

	// not immediate, but there is no other update event
	if (lock_depth == 0) {

		lock_depth++;
		_update_(item);
		lock_depth--;

		if (delay_mode === 0) _executeDelayed_();
		return;
	}

	// there is other update event
	// delay operation is needed
	item.delay_count++;
	const delay_update = delay_update_buffer[delay_update_cur];

	delay_update.push(new ItemManager_Callback(_DelayOperation_updateItem_, name));
	return true;
}


// update delayed operation
function _executeDelayed_() {
	let count = 0;
	while (
		(delay_loop_limit === -1 || count < delay_loop_limit) &&
		delay_update_buffer[delay_update_cur].length !== 0) {

		_executeDelayed_Single_();
		++count;
	}
}


function _executeDelayed_Single_() {
	if (lock_depth !== 0) return;

	// _executeDelayed_ may consist of update event
	// so it will use the lock
	lock_depth++;

	// switch buffer
	const delay_update = delay_update_buffer[delay_update_cur];
	delay_update_cur = (delay_update_cur + 1) % delay_update_buffer.length;

	// operate delayed operation
	for (let callback of delay_update) {
		callback.execute();
	}

	// clear used buffer
	delay_update.splice(0, delay_update.length);

	// release lock
	lock_depth--;
}


function _addCallback_(
	name: string, callback: any, data: any,
	is_create: boolean, is_invoke: boolean) {

	// get item and check if item existed or not
	// if not exist, then check if able to create
	if (!item_table.has(name)) {
		if (!is_create) return false;
		_addItem_(name);
	}

	const item: ItemManager_Item = item_table.get(name);
	if (item.is_blocked) return false;

	// ----- add callback -----
	if (item.is_updating) {
		const delay_update = delay_update_buffer[delay_update_cur];
		delay_update.push(new ItemManager_Callback(_DelayOperation_addCallback_, [name, callback, data]));
		return;
	}

	item.addCallback(callback, data);

	// ----- update -----
	// single invoke (invoke single callback, not all the callback)
	if (!is_invoke) return true;

	// immediate update
	if (lock_depth === 0) {
		lock_depth++;
		callback(item.cache, data);
		lock_depth--;
		return true;
	}

	// delay update
	const delay_update = delay_update_buffer[delay_update_cur];
	delay_update.push(new ItemManager_Callback(_DelayOperation_updateItem_Single_, [name, callback, data]));
	return true;
}


function _rmCallback_(name: string, callback: any) {
	// get item
	if (!item_table.has(name)) return false;
	const item: ItemManager_Item = item_table.get(name);

	if (item.is_blocked) return false;

	// ----- rm callback -----
	if (item.is_updating) {
		const index = item.callback_list.findIndex(element => element === callback);
		if (index < 0) return false;

		const delay_update = delay_update_buffer[delay_update_cur];
		delay_update.push(new ItemManager_Callback(_DelayOperation_rmCallback_, [name, callback]));
		return true;
	}

	return item.rmCallback(callback);
}


function _clearCallback_(name: string) {
	// get item
	if (!item_table.has(name)) return false;
	const item: ItemManager_Item = item_table.get(name);

	if (item.is_blocked) return false;

	// ----- clear callback -----
	if (item.is_updating) {
		const delay_update = delay_update_buffer[delay_update_cur];
		delay_update.push(new ItemManager_Callback(_DelayOperation_clearCallback_, name));
		return true;
	}

	item.callback_list.splice(0, item.callback_list.length);
	return true;
}


// Global Function
export function ItemManager_addCallback(
	name: string, callback: any,
	is_invoke: boolean = true, data: any = null) {

	return _addCallback_(name, callback, data, true, is_invoke);
}


export function ItemManager_rmCallback(name: string, callback: any) {
	return _rmCallback_(name, callback);
}


export function ItemManager_clearCallback(name: string) {
	return _clearCallback_(name);
}


export function ItemManager_setItem(
	name: string, value: any,
	is_invoke: boolean = true, is_immediate: boolean = false) {

	return _setItem_(name, value, is_invoke, is_immediate);
}


export function ItemManager_updateItem(name: string, is_immediate: boolean = false) {
	return _updateItem_(name, is_immediate);
}


export function ItemManager_getItem(name: string) {
	return _getItem_(name);
}


// debug
export function ItemManager_getIsExist(name: string) {
	return item_table.has(name);
}


export function ItemManager_getKeyList() {
	return Array.from(item_table.keys());
}


export function ItemManager_addCallback_UpdatePre(callback: any) {
	const index = hook_update_pre_list.findIndex(element => element === callback);
	if (index >= 0) return false;

	hook_update_pre_list.push(callback);
	return true;
}


export function ItemManager_addCallback_UpdatePost(callback: any) {
	const index = hook_update_post_list.findIndex(element => element === callback);
	if (index >= 0) return false;

	hook_update_post_list.push(callback);
	return true;
}


export function ItemManager_rmCallback_UpdatePre(callback: any) {
	const index = hook_update_pre_list.findIndex(element => element === callback);
	if (index < 0) return false;

	hook_update_pre_list.splice(index, 1);
	return true;
}


export function ItemManager_rmCallback_UpdatePost(callback: any) {
	const index = hook_update_post_list.findIndex(element => element === callback);
	if (index < 0) return false;

	hook_update_post_list.splice(index, 1);
	return true;
}


export function ItemManager_getState() {
	return {
		lock_depth: lock_depth
	};
}


export function ItemManager_getCallback(name: string) {
	if (!item_table.has(name)) return [];
	const list = item_table.get(name).callback_list;
	return Array.from(list);
}
