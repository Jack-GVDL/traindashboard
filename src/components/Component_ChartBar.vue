<template>
	<div class="fill-height">

		<v-container
			class="my-0 py-0"
		>
			<v-row>

				<!--  title -->
				<v-col
					class="mx-2 white--text text-h6 font-weight-light"
				>
					{{ text_title }}
				</v-col>
				<!-- title -->

				<v-spacer></v-spacer>

				<!-- button - edit -->
				<v-col
					class="d-flex justify-end"
				>
					<v-btn
						@click="Handler_editor"
						dark
						icon
						small
					>
						<v-icon
							small
							color="#C6C8CA"
						>
							mdi-cog
						</v-icon>
					</v-btn>
				</v-col>
				<!-- button - edit -->

			</v-row>
		</v-container>

		<!-- chart -->
		<Chart_Bar
				style="height: 90%;"
				v-bind:Interface_data="chart_data"
				v-bind:Interface_label="chart_label"
		/>
		<!-- chart -->

	</div>
</template>


<script>
import Chart_Bar from "@/components/Chart_Bar";
import {
	ItemManager_addCallback,
	ItemManager_clearCallback,
	ItemManager_setItem
} from "@/utility/ItemManager";

import {
	Observer_LogData_addCallback_Add,
	Observer_LogData_addCallback_Config,
	Observer_LogData_addCallback_Rm,
	Observer_LogData_create
} from "@/utility/Observer_LogData";
import {
	WidgetControl_configWidget
} from "@/utility/WidgetControl";


export default {
	name: "Component_ChartBar",

	components: {
		Chart_Bar
	},

	props: [
		"Interface_id",
	],

	data: () => ({
		// observer
		id_observer: -1,

		// chart
		chart_data: [[]],
		chart_label: [[]],

		dataset: [],

		// title, editor
		text_title: ""
	}),

	methods: {
		Handler_editor() {
			ItemManager_setItem("Editor/component", [
				{
					name: "Editor_Title"
				},
				{
					name: "Editor_Dataset"
				}
			]);

			// editor
			ItemManager_setItem("Editor/enable", true);

			// editor - dataset
			ItemManager_setItem("Editor/Dataset/id_observer", this.id_observer);

			// editor - title
			ItemManager_setItem("Editor/Title/data", this.text_title);
			ItemManager_clearCallback("Editor/Title/hook_update");
			ItemManager_addCallback("Editor/Title/hook_update", this.Hook_updateTitle, false);
		},

		// hook - observer (data)
		Hook_Observer_addData(data) {
			if (data == null) return;

			// get color
			const color = data.custom.rgba_color;

			this.dataset.push({
				id:								data.log_data.id,
				data: 						data.log_data.data,
				borderColor:			"rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")",
				backgroundColor:	"rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")",
				fill:							false,
				label:						data.custom.label,
			});
			this.Internal_updateGraph();
		},

		Hook_Observer_rmData(data) {
			if (data == null) return;

			// get index
			const index = this.dataset.findIndex(element => element.id === data.log_data.id);
			if (index < 0) return;

			// remove target
			this.dataset.splice(index, 1);
			this.Internal_updateGraph();
		},

		Hook_Observer_configData(data) {
			if (data == null) return;

			// get index
			const index = this.dataset.findIndex(element => element.id === data.log_data.id);
			if (index < 0) return;

			// update target
			const target = this.dataset[index];
			const color = data.custom.rgba_color;

			target.data 						= data.log_data.data;
			target.borderColor			= "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
			target.backgroundColor	= "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
			target.label						= data.custom.label;

			// this.dataset.splice(index, 1, target);
			this.Internal_updateGraph();
		},

		// hook - title, graph config
		Hook_updateTitle(title) {
			if (title == null) return;
			this.text_title = title;

			// set title to widget
			WidgetControl_configWidget(this.Interface_id, (widget) => widget.name = title);
		},

		Internal_updateGraph() {
			// CONFIG
			let length = 0;
			for (let i = 0; i < this.dataset.length; ++i) {
				length = this.dataset[i].data.length <= length ? length : this.dataset[i].data.length;
			}

			// CORE
			// label
			const label_list = [];

			for (let i = 0; i < length; ++i) {
				label_list.push(i.toString());
			}

			// update graph
			this.chart_data.splice(0, 1, this.dataset);
			this.chart_label.splice(0, 1, label_list);
		}
	},

	mounted() {
		// update graph
		this.Internal_updateGraph();

		// observer
		this.id_observer = Observer_LogData_create();
		Observer_LogData_addCallback_Add(				this.id_observer, this.Hook_Observer_addData);
		Observer_LogData_addCallback_Rm(				this.id_observer, this.Hook_Observer_rmData);
		Observer_LogData_addCallback_Config(		this.id_observer, this.Hook_Observer_configData);
	},

	watch: {
	}
}
</script>


<style scoped>
</style>
