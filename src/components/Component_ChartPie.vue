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
		<Chart_Pie
				style="height: 70%;"
				v-bind:Interface_data="chart_data"
				v-bind:Interface_label="chart_label"
		/>
		<!-- chart -->
	</div>
</template>


<script>
import Chart_Pie from "@/components/Chart_Pie";
import {ItemManager_addCallback, ItemManager_clearCallback, ItemManager_setItem} from "@/utility/ItemManager";
import {
	Observer_LogData_addCallback_Add, Observer_LogData_addCallback_Config,
	Observer_LogData_addCallback_Rm,
	Observer_LogData_create
} from "@/utility/Observer_LogData";


export default {
	name: "Component_ChartPie",

	components: {
		Chart_Pie
	},

	data: () => ({
		// chart
		chart_data: [[]],
		chart_label: [[]],

		dataset: [],

		// title
		text_title: "Pie Chart"
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
			ItemManager_addCallback("Editor/Title/hook_update", this.Hook_updateTitle);
		},

		Hook_Observer_addData(data) {
			if (data == null) return;

			// get color
			const color = data.custom.rgba_color;

			this.dataset.push({
				id:				data.log_data.id,
				data: 		data.log_data.data.length === 0 ? 0 : data.log_data.data[0],
				color: 		"rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")",
				fill:			false,
				label:		data.custom.label,
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

			target.data 	= data.log_data.data.length === 0 ? 0 : data.log_data.data[0];
			target.color	= "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
			target.label	= data.custom.label;

			// this.dataset.splice(index, 1, target);
			this.Internal_updateGraph();
		},

		Hook_updateTitle(title) {
			if (title == null) return;
			this.text_title = title;
		},

		Internal_updateGraph() {
			// dataset, label
			const data_list = [];
			const color_list = [];
			const label_list = [];

			for (let i = 0; i < this.dataset.length; ++i) {
				data_list.push(this.dataset[i].data);
				color_list.push(this.dataset[i].color);
				label_list.push(this.dataset[i].label);
			}

			const data = [{
				data: 						data_list,
				backgroundColor: 	color_list,
				borderColor: 			"transparent"
			}];

			// update
			this.chart_data.splice(0, 1, data);
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
