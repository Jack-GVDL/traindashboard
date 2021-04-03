<template>
	<v-toolbar
		color="#1c212c"
	>

		<!-- search field -->
		<v-text-field
			v-model="text_search"
			@input="Handler_searchWidget()"
			@blur="Handler_searchEnd()"
			class="white--text font-weight-light"
			dark
		>
		</v-text-field>
		<!-- search field -->

		<!-- search button -->
		<v-btn
			icon
		>
			<v-icon
				color="white"
			>
				mdi-magnify
			</v-icon>
		</v-btn>
		<!-- search button -->

		<v-spacer></v-spacer>

		<!-- message -->
		<v-slide-x-reverse-transition>
			<div
				:class="color_save_message"
				class="mx-2 white--text text-h6 font-weight-light"
				v-if="is_show_save_message"
			>
				{{ text_save_message }}
			</div>
		</v-slide-x-reverse-transition>
		<!-- message -->

		<!-- save, load button -->
		<v-btn
			@click="Handler_save()"
			icon
		>
			<v-icon
				color="white"
			>
				mdi-progress-upload
			</v-icon>
		</v-btn>

		<v-btn
			@click="Handler_load()"
			icon
		>
			<v-icon
				color="white"
			>
				mdi-progress-download
			</v-icon>
		</v-btn>
		<!-- save, load button -->

		<!-- toggle widget delete button -->
		<v-btn
			@click="Handler_delete()"
			icon
		>
			<v-icon
				:color="is_delete_enable ? 'red' : 'white'"
			>
				{{ is_delete_enable ? "mdi-delete" : "mdi-delete-outline" }}
			</v-icon>
		</v-btn>
		<!-- toggle widget delete button -->

		<!-- more option -->
		<v-btn
			icon
		>
			<v-icon
				color="white"
			>
				mdi-dots-vertical
			</v-icon>
		</v-btn>
		<!-- more option -->

	</v-toolbar>
</template>


<script>
import {
	WidgetControl_configWidget,
	WidgetControl_getWidgetList,
	WidgetControl_pull,
	WidgetControl_push,
	WidgetControl_updateAll
} from "@/utility/WidgetControl";
import {
} from "@/utility/Server_Layout";
import {
	ItemManager_setItem
} from "@/utility/ItemManager";


export default {
	name: "Topbar",

	data:() => ({
		// search
		text_search: "",

		// save button, save message
		is_show_save_message: false,
		text_save_message: "",
		color_save_message: "white--text",

		// delete button
		is_delete_enable: false,
	}),

	methods: {
		// handler
		Handler_delete() {
			this.is_delete_enable = !this.is_delete_enable;
			ItemManager_setItem("Dashboard/toggle_delete_button", null);
		},

		// TODO
		Handler_save() {
			WidgetControl_push();
		},

		Handler_load() {
			WidgetControl_pull();
		},

		Handler_searchWidget() {
			// get widget list
			// assumed that widget list is sorted based on id
			const widget_list = WidgetControl_getWidgetList();

			// filter
			// if text field is empty
			// then no widget is being selected
			let target_list = [];
			if (this.text_search.length !== 0) {
				target_list = widget_list.filter(
					element => element.name.includes(this.text_search)
				);
			}

			// config widget
			const size_target   = target_list.length;
			let   index_target  = 0;
			let   is_ended      = index_target === size_target;

			for (let widget of widget_list) {
				if (is_ended) {
					widget.state.is_focused = false;
					continue;
				}

				if (widget.id < target_list[index_target].id) {
					widget.state.is_focused = false;
					continue;
				}

				if (widget.id === target_list[index_target].id) {
					widget.state.is_focused = true;
					index_target++;
					if (index_target === size_target) is_ended = true;
					continue;
				}

				// if (widget.id > target_list[index_target].id)
				widget.state.is_focused = false;

				index_target++;
				while (index_target < size_target) {
					if (widget.id > target_list[index_target].id) {
						index_target++;
						continue;
					}
					break;
				}

				if (index_target === size_target) is_ended = true;
			}

			// update all
			WidgetControl_updateAll();
		},

		Handler_searchEnd() {
			// reset text field
			this.text_search = "";

			// get widget list
			const widget_list = WidgetControl_getWidgetList();

			// reset state of each widget
			for (let widget of widget_list) {
				widget.state.is_focused = false;
			}

			// update all
			WidgetControl_updateAll();
		},

		// hook
		Hook_updateStatus_SetLayout(data) {
			if (data == null) return;

			// table of save message
			const save_message_list = [
				"",
				"Saving",
				"Save Success",
				"Save Failed",
			];

			this.text_save_message = save_message_list[data];

			// if start saving, then display the message
			if (data === 0) this.is_show_save_message = true;

			// after saving (whenever it is success or not), make the text fade after a certain time
			if (data === 2 || data === 3) {
				setTimeout(() => {
					this.is_show_save_message = false;
				}, 1000);
			}

			// set icon color
			if (data === 3) this.color_save_message = "white--text";
			else            this.color_save_message = "red--text";
		},
	},

	mounted() {
	},

	watch: {
	}
};
</script>


<style scoped>
/*.background_back {*/
/*	background-color: #12161f;*/
/*}*/

/*.background_panel_darken_1 {*/
/*	background-color: #1c212c;*/
/*}*/

/*.background_panel {*/
/*	background-color: #2e3442;*/
/*}*/

/*.background_panel_lighten_1 {*/
/*	background-color: #43485a;*/
/*}*/
</style>
