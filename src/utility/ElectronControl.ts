// Import
const { remote } = require("electron");


// Data
let is_full_screen = false;


// Local Function
//...


// Global Function
export function Electron_toggleFullScreen() {
	is_full_screen = !is_full_screen;
	remote.getCurrentWindow().setFullScreen(is_full_screen);
}


export function Electron_setFullScreen(value: boolean) {
	is_full_screen = value;
	remote.getCurrentWindow().setFullScreen(is_full_screen);
}


export function Electron_enableFullScreen() {
	is_full_screen = true;
	remote.getCurrentWindow().setFullScreen(is_full_screen);
}


export function Electron_disableFullScreen() {
	is_full_screen = false;
	remote.getCurrentWindow().setFullScreen(is_full_screen);
}


export function Electron_reload() {
	remote.getCurrentWindow().reload();
}
