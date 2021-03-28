<template>
	<v-toolbar
		color="#1c212c"
	>

		<!-- search field -->
		<v-text-field
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

		<!-- save button -->
		<v-slide-x-reverse-transition>
			<div
				:class="color_save_message"
				class="mx-2 white--text text-h6 font-weight-light"
				v-if="is_show_save_message"
			>
				{{ text_save_message }}
			</div>
		</v-slide-x-reverse-transition>

		<v-btn
			@click="Handler_save()"
			icon
		>
			<v-icon
				color="white"
			>
				mdi-content-save
			</v-icon>
		</v-btn>
		<!-- save button -->

	</v-toolbar>
</template>


<script>
import {
	WidgetControl_getWidgetList
} from "@/utility/WidgetControl";
import {
	Server_Layout_setLayout,
	Server_Layout_Status_SetLayout_addCallback
} from "@/utility/Server_Layout";


export default {
	name: "Topbar",

	data:() => ({
		// save button, save message
		is_show_save_message: false,
		text_save_message: "",
		color_save_message: "white--text",
	}),

	methods: {
		// handler
		Handler_save() {
			// get widget list
			const widget_list = WidgetControl_getWidgetList();

			// save to server
			Server_Layout_setLayout(widget_list);
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
		Server_Layout_Status_SetLayout_addCallback(this.Hook_updateStatus_SetLayout);
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
