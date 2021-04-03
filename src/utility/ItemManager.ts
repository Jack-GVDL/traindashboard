// Local Data
const item_callback = new Map();
const item_cache    = new Map();
const item_flag     = new Map();
const delay_update: string[]  = [];

let is_updating = false;
let lock_depth = 0;

const hook_update_pre_list: any[]  = [];


// Local Function
// hash
// currently the hash is just the string itself
function _getHash_(name: string) {
  return name;
}


function _addItem_(item_name: string) {
  // compute item_name hash
  const hash = _getHash_(item_name);

  // check if the item_name exist or not
  if (item_cache.has(hash)) return false;

  // actual add
  item_cache.set(hash, null);
  item_callback.set(hash, []);
  item_flag.set(hash, 0);
  return true;
}


function _rmItem_(item_name: string) {
  // compute item_name hash
  const hash = _getHash_(item_name);

  // check if the item_name exist or not
  // then check if able to modify the item or not
  if (!item_cache.has(hash))    return false;
  if (item_flag.get(hash) == 1) return false;

  // actual rm
  item_cache.delete(hash);
  item_callback.delete(hash);
  item_flag.delete(hash);
  return true;
}


function _setItem_(
    item_name: string, value: any,
    is_create: boolean = false, is_invoke: boolean = true, is_immediate: boolean = false) {

  // compute item_name hash
  const hash = _getHash_(item_name);

  // check if the item_name exist or not
  // then check if able to modify the item or not
  if (!item_cache.has(hash)) {
    if (!is_create) return false;
    _addItem_(item_name);
  }
  if (item_flag.get(hash) == 1) return false;

  // set item
  item_cache.set(hash, value)

  // callback
  if (is_invoke) _update_(null, hash, true, is_immediate);
  return true;
}


function _getItem_(item_name: string, default_none: any = null) {
  // compute item_name hash
  const hash = _getHash_(item_name);

  // check if the item_name exist or not
  // if not exist, return default none
  // else, return the value
  if (!item_cache.has(hash)) return default_none;
  return item_cache.get(hash);
}


function _getIsExist_(item_name: string) {
  // compute item_name hash
  const hash = _getHash_(item_name)

  // check if item exist or not
  if (!item_cache.has(hash)) return false;
  return true;
}


function _addCallback_(
  item_name: any, callback: any,
  data: any = null, is_create: boolean = true, is_invoke: boolean = true) {

  // compute item_name hash
  const hash = _getHash_(item_name);

  // check if the item_name exist or not
  if (!item_cache.has(hash)) {
    if (!is_create) return false;
    _addItem_(item_name);
  }

  // check if callback already existed in callback_list
  // if existed, just update the data part is ok
  const callback_list = item_callback.get(hash);
  const index = callback_list.findIndex((element: any[]) => element[0] == callback);

  if (index >= 0) {
    callback_list[index][1] = data;
    return true;
  }

  // add to callback
  callback_list.push([callback, data]);

  // check if need to update
  if (!is_invoke) return true;

  // update this callback only
  // remember to lock the item before calling the callback and unlock it after done
  const cache = item_cache.get(hash);
  item_flag.set(hash, 1);
  callback(cache, data);
  item_flag.set(hash, 0);

  return true;
}


function _rmCallback_(item_name: any, callback: any) {
  // compute item_name hash
  const hash = _getHash_(item_name);

  // check if the item_name exist or not
  if (!item_cache.has(hash)) return false;

  // actual removal
  const callback_list = item_callback.get(hash);
  const index = callback_list.findIndex((element: any[]) => element[0] == callback);
  if (index < 0) return false;

  callback_list.splice(index, 1);
  return true;
}


function _clearCallback_(item_name: any) {
  // compute item_name hash
  const hash = _getHash_(item_name);

  // check if the item_name exist or not
  if (!item_cache.has(hash)) return false;

  // actual removal
  const callback_list = item_callback.get(hash);
  while (callback_list.length !== 0) callback_list.pop();

  return true;
}


function _updateDelayed_() {
  while (delay_update.length !== 0) {
    const item_name = delay_update[0];
    delay_update.splice(0, 1);
    _update_(item_name);
  }
}


function _update_(item_name: any, hash: any = null, is_checked: boolean = false, is_immediate: boolean = false) {
  // compute item_name hash
  if (hash == null) hash = _getHash_(item_name);

  // check if the item_name exist or not
  // then check if the item already in update process or not
  if (!is_checked && !item_cache.has(hash)) return false;
  if (item_flag.get(hash) == 1)             return false;

  // global update lock
  // but there is a situation that can bypass the lock: immediate update
  if (is_updating && !is_immediate) {
    delay_update.push(hash);
    return;
  }
  is_updating = true;
  lock_depth++;

  // ----- item -----
  // get item
  const item = item_cache.get(hash);

  // lock the item
  item_flag.set(hash, 1);

  // ----- callback -----
  const callback_list = item_callback.get(hash);

  // hook: before update
  for (const callback of hook_update_pre_list) {
    callback(hash, item, callback_list);
  }

  // foreach callback
  for (const callback of callback_list) {
    callback[0](item, callback[1]);
  }

  // hook
  // TODO

  // unlock the item
  item_flag.set(hash, 0);

  // unlock global update flag if lock_depth === 0
  // if unlocked, update pending update
  lock_depth--;
  if (lock_depth === 0) {
    is_updating = false;
    _updateDelayed_();
  }

  return true;
}


function _getKeyList_() {
  return Array.from(item_cache.keys());
}


// Global Function
export function ItemManager_addCallback(
    item_name: string, callback: any,
    is_invoke: boolean = true, data: any = null) {

  return _addCallback_(item_name, callback, data, true, is_invoke);
}


export function ItemManager_rmCallback(item_name: string, callback: any) {
  return _rmCallback_(item_name, callback);
}


export function ItemManager_clearCallback(item_name: string) {
  return _clearCallback_(item_name);
}


export function ItemManager_setItem(
    item_name: string, value: any,
    is_invoke: boolean = true, is_immediate: boolean = false) {

  return _setItem_(item_name, value, true, is_invoke, is_immediate);
}


export function ItemManager_updateItem(item_name: string, is_immediate: boolean = false) {
  return _update_(item_name, null, false, is_immediate);
}


export function ItemManager_getItem(item_name: string, default_none: any = null) {
  return _getItem_(item_name, default_none);
}


export function ItemManager_getIsExist(item_name: string) {
  return _getIsExist_(item_name);
}


// debug
export function ItemManager_getKeyList() {
  return _getKeyList_();
}


export function ItemManager_addCallback_UpdatePre(callback: any) {
  const index = hook_update_pre_list.findIndex(element => element == callback);
  if (index >= 0) return false;

  hook_update_pre_list.push(callback);
  return true;
}


export function ItemManager_getState() {
  return {
    lock_depth: lock_depth
  };
}


export function ItemManager_getCallback(name: string) {
  if (!item_callback.has(name)) return [];
  return item_callback.get(name);
}
