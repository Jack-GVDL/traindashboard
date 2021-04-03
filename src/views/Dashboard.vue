<template>
	<div
			style="width: 100%;"
			class="background_back"
	>
		<Topbar/>

		<grid-layout
				:layout.sync="layout"
				:col-num="3"
				:row-height="30"
				:is-draggable="draggable"
				:is-resizable="resizable"
				:responsive="responsive"
				:is-mirrored="false"
				:vertical-compact="true"
				:margin="[10, 10]"
				:use-css-transforms="true"
		>
			<grid-item
					v-for="item in layout"
					:static="item.is_static"
					:x="item.x"
					:y="item.y"
					:w="item.w"
					:h="item.h"
					:i="item.i"
					:key="item.i"
					drag-allow-from=".draggable"
					drag-ignore-from=".no-drag"
			>
				<v-card
						:style="item.style_card"
						style="height: 100%; background-color: #2e3442;"
						class="background_panel"
						outlined
				>
					<v-container
						fluid
						class="fill-height d-flex align-start"
					>

						<v-row class="draggable">
							<v-spacer></v-spacer>

							<v-col class="py-1 my-0 d-flex justify-end">

								<!-- pin button -->
								<v-btn
									@click="Handler_pin(item.i);"
									dark
									icon
									small
								>
									<v-icon
										small
										color="white"
									>
										{{ item.is_static ? "mdi-pin" : "mdi-pin-off" }}
									</v-icon>
								</v-btn>
								<!-- pin button -->

								<!-- close button -->
								<v-btn
									v-show="is_show_delete"
									@click="Handler_close(item);"
									dark
									icon
									small
								>
									<v-icon
										small
										color="white"
									>
										mdi-close
									</v-icon>
								</v-btn>
								<!-- close button -->

							</v-col>

						</v-row>

						<v-row
								style="height: 90%;"
								class="py-0"
						>
							<v-col
									class="pt-0 fill-height"
							>

								<!-- component -->
								<div
										:is="item.component"
										v-bind:Interface_id="item.id"
								>
								</div>
								<!-- component -->

							</v-col>
						</v-row>

					</v-container>
				</v-card>
			</grid-item>
		</grid-layout>

	</div>
</template>


<script>
import {
	GridLayout,
	GridItem
} from "vue-grid-layout";
import Component_ChartLine from "@/components/Component_ChartLine";
import Component_ChartBar from "@/components/Component_ChartBar";
import Component_ChartPie from "@/components/Component_ChartPie";
import Component_SingleNumber from "@/components/Component_SingleNumber";
import Component_TextField from "@/components/Component_TextField";
import Component_ItemList from "@/components/Component_ItemList";
import Topbar from "@/views/Topbar";
import {
	WidgetControl_addCallback_AddWidget,
	WidgetControl_addCallback_ConfigWidget,
	WidgetControl_addCallback_InitWidget,
	WidgetControl_addCallback_RmWidget,
	WidgetControl_addCallback_RefreshWidget,
	WidgetControl_configWidget,
	WidgetControl_rmWidget
} from "@/utility/WidgetControl";
import {
	ItemManager_addCallback, ItemManager_setItem
} from "@/utility/ItemManager";


export default {
	name: "Dashboard",

	components: {
		Topbar,
		GridLayout,
		GridItem,
		Component_ChartLine,
		Component_ChartBar,
		Component_ChartPie,
		Component_SingleNumber,
		Component_TextField,
		Component_ItemList,
	},

	props: [
		"Interface_addWidget"
	],

	data: () => ({
		// grid system
		draggable:  true,
		resizable:  true,
		responsive: true,

		layout: [],
		layout_index: 1,
		layout_col:   3,

		// display
		icon_minimize:  "mdi-minus",
		icon_expand:    "mdi-plus",

		is_show_delete: false,
	}),

	methods: {
		// handler
		Handler_close(data) {
			WidgetControl_rmWidget(data.id);
		},

		Handler_pin(id) {
			const index = this.layout.findIndex(element => element.i === id);
			if (index < 0) return;
			this.layout[index].is_static = !this.layout[index].is_static;
		},

		// hook
		Hook_WidgetControl_initWidget(data) {
			if (data == null) return;

			// check data.custom.dashboard
			if (data.custom["dashboard"] !== undefined) {

				// still needed to call cause following is assuming not present / not up-to-date
				// - layout_index
				//
				// but it is assumed that value type of rest of item are correct
				const dashboard = this.Internal_addWidget(data.id, data.component);
				data.custom.dashboard.id = dashboard.id;
				return;
			}

			// data.custom.dashboard does not exist
			// add new one
			const dashboard = this.Internal_addWidget(data.id, data.component);
			data.custom["dashboard"] = dashboard;
		},

		Hook_WidgetControl_addWidget(data) {
			if (data == null) return;
			const dashboard = data.custom.dashboard;
			this.layout.push(dashboard);
		},

		Hook_WidgetControl_rmWidget(data) {
			if (data == null) return;

			// get index
			const index = this.layout.findIndex(element => element.id === data.id);
			if (index < 0) return;

			// remove from layout
			this.Internal_rmWidget(index);
		},

		Hook_WidgetControl_configWidget(data) {
			if (data == null) return;

			// get index
			const index = this.layout.findIndex(element => element.id === data.id);
			if (index < 0) return;

			// assumed: exist: data.custom.dashboard
			this.Internal_configWidget(index, data.custom.dashboard, data.state.is_focused);
		},

		Hook_WidgetControl_updateWidget(widget) {
			if (widget == null) return;

			// get index
			const index = this.layout.findIndex(element => element.id === widget.id);
			if (index < 0) return;

			// update widget.custom.dashboard and main info (e.g. widget.x, ...)
			const dashboard = this.layout[index];

			widget.custom["dashboard"] = dashboard;
			widget.x = dashboard.x;
			widget.y = dashboard.y;
			widget.w = dashboard.w;
			widget.h = dashboard.h;
		},

		// hook - internal
		Hook_Internal_toggleDeleteButton() {
			this.is_show_delete = !this.is_show_delete;
		},

		// internal
		Internal_addWidget(id, component) {
			// create
			const widget = {
				// data
				id:         id,

				is_static:  false,
				x:          0,
				y:          this.layout.length * 5,
				w:          2,
				h:          10,
				i:          this.layout_index,

				component:  component,

				style_card: "",

				// function
				func_to_json:   this.Hook_WidgetControl_convertToJson,
			};
			this.layout_index++;

			// add
			// this.layout.push(widget);

			return widget;
		},

		Internal_rmWidget(index) {
			this.layout.splice(index, 1);
		},

		Internal_configWidget(index, data, is_focused) {
			// reset data
			this.layout[index].is_static  = data.is_static;
			// this.layout[index].x          = data.x;
			// this.layout[index].y          = data.y;
			// this.layout[index].w          = data.w;
			// this.layout[index].h          = data.h;
			this.layout[index].i          = data.i;
			this.layout[index].component  = data.component;

			this.layout[index].style_card = "";
			if (is_focused) {
				this.layout[index].style_card += "border: 1px solid gray;";
			}

			// update
			this.layout.splice(index, 1, this.layout[index]);
		},
	},

	mounted() {
		// push item
		ItemManager_addCallback(
			"Dashboard/toggle_delete_button",
			this.Hook_Internal_toggleDeleteButton, false);

		// add callback
		WidgetControl_addCallback_AddWidget(this.Hook_WidgetControl_addWidget);
		WidgetControl_addCallback_RmWidget(this.Hook_WidgetControl_rmWidget);
		WidgetControl_addCallback_ConfigWidget(this.Hook_WidgetControl_configWidget);
		WidgetControl_addCallback_InitWidget(this.Hook_WidgetControl_initWidget);
		WidgetControl_addCallback_RefreshWidget(this.Hook_WidgetControl_updateWidget);
	},

	watch: {
	}
}
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

.draggable {
}

.no-drag {
}

.dab-card {
	width: 100%;
	height: auto;
	display: flex;
	flex-direction: column;
	padding: 10px;
	background-color: #fff;
	border: #f1f1f1 solid 1px;
	border-radius: 3px;
	box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.03);
	position: relative;
}
</style>
