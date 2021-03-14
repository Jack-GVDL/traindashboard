<template>
	<div
			style="background-color: #FFFFFF; width: 100%; "
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
						style="height: 100%;"
						outlined
				>
					<v-container fluid class="fill-height d-flex align-start">

						<v-row class="draggable">
							<v-spacer></v-spacer>

							<v-col class="py-1 my-0 d-flex justify-end">
								<v-btn
										icon
										small
								>
									<v-icon
											@click="Handler_minimize(item.i);"
											small
									>
										{{ !item.is_minimize ? icon_minimize : icon_expand }}
									</v-icon>
								</v-btn>

								<!-- close button -->
								<v-btn
										@click="Handler_close(item.i);"
										icon
										small
								>
									<v-icon
										small
									>
										mdi-close
									</v-icon>
								</v-btn>
								<!-- close button -->

							</v-col>

						</v-row>

						<v-row
								v-show="!item.is_minimize"
								style="height: 90%;"
								class="py-0"
						>
							<v-col
									class="pt-0 fill-height"
							>
								<div :is="item.component"></div>
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


export default {
	name: "Dashboard",

	components: {
		GridLayout,
		GridItem,
		Component_ChartLine
	},

	props: [
		"Interface_addWidget"
	],

	data: () => ({
		// grid system
		draggable: true,
		resizable: true,
		responsive: true,

		layout: [],
		layout_index: 0,
		layout_col: 3,

		// display
		icon_minimize: "mdi-minus",
		icon_expand: "mdi-plus"
	}),

	methods: {
		// hook
		Handler_close(id) {
			const index = this.layout.findIndex(element => element.i === id);
			if (index < 0) return;
			this.Internal_rmWidget(index);
		},

		Handler_minimize(id) {
			const index = this.layout.findIndex(element => element.i === id);
			if (index < 0) return;

			this.layout[index].is_minimize = !this.layout[index].is_minimize;
			if (this.layout[index].is_minimize) {
				this.layout[index].full_h = this.layout[index].h;
				this.layout[index].h = 1;
			}
			else {
				this.layout[index].h = this.layout[index].full_h;
			}
		},

		// internal
		Internal_addWidget(component) {
			this.layout.push({
				x: 0,
				y: this.layout.length * 5,
				w: 2,
				h: 5,
				i: this.layout_index,

				is_minimize: false,
				full_h: 5,

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
