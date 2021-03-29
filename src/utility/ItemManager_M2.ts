// Import
// ...


// Data Structure
class ItemManager_Callback {
	// data
	callback: 	any;
	data:		any;

	// function
	constructor(callback: any, data: any) {
		this.callback = callback;
		this.data	  = data;
	}
}


class ItemManager_Item {
	// data
	callback_list:	ItemManager_Callback[];
	cache:			any;	// target item
	flag:			bigint	= 0n;

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
		for (const callback of this.callback_list) {
			callback.callback(this.cache, callback.data);
		}
	}
}


// Local Data
const item_table 	= new Map();

let lock_depth 		= 0;  	// lock_depth
const delay_update 	= [];  	// list of ItemManager_Callback, not map cause need the order
let delay_time		= 200;  // default: 200ms

const hook_update_pre_list: 	any[] = []
const hook_update_post_list:	any[] = []


// Local Function
// this is used for delay operation
function _DelayOperation_rmItem_(name: any) {
	if (name == null) return;
	item_table.delete(name);
}


function _DelayOperation_updateItem_(name: any) {
	if (name == null) return;
	_updateItem_(name);
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
	// if is updating, then delay the remove operation
	if (lock_depth === 0) 	item_table.delete(name);
	else					delay_update.push(new ItemManager_Callback(_DelayOperation_rmItem_, name));
	return true;
}


function _updateItem_(name: string, is_checked: boolean = false, is_immediate: boolean = false) {

}
