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
	WidgetControl_addCallback_addWidget,
	WidgetControl_addCallback_configWidget,
	WidgetControl_addCallback_rmWidget, WidgetControl_configWidget, WidgetControl_rmWidget
} from "@/utility/WidgetControl";


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
		icon_expand:    "mdi-plus"
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
		Hook_WidgetControl_addWidget(data) {
			if (data == null) return;

			// check if id existed or not
			// but normally id should not occur
			// ...

			// add widget
			const data_dashboard = this.Internal_addWidget(data.id, data.component);

			// check if data already contain data.custom.dashboard
			if (data.custom["dashboard"] !== undefined) {
				const index = this.layout.findIndex(element => element.id === data.id);
				this.Internal_configWidget(index, data.custom["dashboard"]);
				return;
			}

			// add custom
			WidgetControl_configWidget(data.id, (custom) => {
				custom["dashboard"] = data_dashboard;
				return  custom;
			});
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
			this.Internal_configWidget(index, data.custom.dashboard);
		},

		// internal
		Internal_addWidget(id, component) {
			// create
			const widget = {
				id:         id,

				is_static:  false,
				x:          0,
				y:          this.layout.length * 5,
				w:          2,
				h:          10,
				i:          this.layout_index,

				component: component,
			};
			this.layout_index++;

			// add
			this.layout.push(widget);

			return widget;
		},

		Internal_rmWidget(index) {
			this.layout.splice(index, 1);
		},

		Internal_configWidget(index, data) {
			// reset data
			this.layout[index].is_static  = data.is_static;
			this.layout[index].x          = data.x;
			this.layout[index].y          = data.y;
			this.layout[index].w          = data.w;
			this.layout[index].h          = data.h;
			this.layout[index].i          = data.i;
			this.layout[index].component  = data.component;

			// update
			this.layout.splice(index, 1, this.layout[index]);
		},
	},

	mounted() {
		// add callback
		WidgetControl_addCallback_addWidget(this.Hook_WidgetControl_addWidget);
		WidgetControl_addCallback_rmWidget(this.Hook_WidgetControl_rmWidget);
		WidgetControl_addCallback_configWidget(this.Hook_WidgetControl_configWidget);
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
