<template>
	<div
			style="width: 100%;"
			class="background_back"
	>
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
										@click="Handler_close(item.i);"
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
import { GridLayout, GridItem } from "vue-grid-layout";
import Component_ChartLine from "@/components/Component_ChartLine";
import Component_ChartBar from "@/components/Component_ChartBar";
import Component_ChartPie from "@/components/Component_ChartPie";
import Component_SingleNumber from "@/components/Component_SingleNumber";


export default {
	name: "Dashboard",

	components: {
		GridLayout,
		GridItem,
		Component_ChartLine,
		Component_ChartBar,
		Component_ChartPie,
		Component_SingleNumber,
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
		layout_index: 0,
		layout_col:   3,

		// display
		icon_minimize:  "mdi-minus",
		icon_expand:    "mdi-plus"
	}),

	methods: {
		// hook
		Handler_close(id) {
			const index = this.layout.findIndex(element => element.i === id);
			if (index < 0) return;
			this.Internal_rmWidget(index);
		},

		Handler_pin(id) {
			const index = this.layout.findIndex(element => element.i === id);
			if (index < 0) return;
			this.layout[index].is_static = !this.layout[index].is_static;
		},

		// internal
		Internal_addWidget(component) {
			this.layout.push({
				is_static:  false,
				x:          0,
				y:          this.layout.length * 5,
				w:          2,
				h:          10,
				i:          this.layout_index,

				component: component
			});
			this.layout_index++;
		},

		Internal_rmWidget(index) {
			this.layout.splice(index, 1);
		}
	},

	mounted() {
	},

	watch: {
		Interface_addWidget(new_value, old_value){
			this.Internal_addWidget(new_value[0].component);
		}
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
