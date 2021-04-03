<template>
	<div class="fill-height">

		<v-container
			class="my-0 py-0"
		>
			<v-row>

				<!--  title -->
				<v-col
						class="mx-2 white--text text-h6 font-weight-light d-flex justify-space-between"
				>
					{{ text_title }}
				</v-col>
				<!-- title -->

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
		<Chart_Line
				style="height: 90%;"
				v-bind:Interface_data="chart_data"
				v-bind:Interface_label="chart_label"
				v-bind:Interface_option="chart_option"
		/>
		<!-- chart -->

	</div>
</template>


<script>
import Chart_Line from "@/components/Chart_Line";
import {
	ItemManager_addCallback,
	ItemManager_clearCallback,
	ItemManager_setItem
} from "@/utility/ItemManager";
import {
	Observer_LogData_create,
	Observer_LogData_addCallback_Add,
	Observer_LogData_addCallback_Rm,
	Observer_LogData_addCallback_Config
} from "@/utility/Observer_LogData";
import {
	WidgetControl_addCallback_ConfigWidget_Single,
	WidgetControl_addCallback_RefreshWidget_Single,
	WidgetControl_configWidget,
	WidgetControl_updateWidget
} from "@/utility/WidgetControl";


export default {
	name: "Component_ChartLine",

	components: {
		Chart_Line
	},

	props: [
		"Interface_id",
	],

	data: () => ({
		// observer
		id_observer: -1,

		// chart interface
		chart_data: 	[[]],
		chart_label: 	[[]],
		chart_option: [{}],

		dataset: [],

		// title, editor
		text_title: "",

		// editor info
		value_config_list: [
			{
				id:         0,
				name:       "Line thickness",
				component:  "Config_ValueInt",
				value:      1,
				callback:   null,
				custom:     null,
			},
			{
				id:         1,
				name:       "Fill background",
				component:  "Config_ValueBool",
				value:      false,
				callback:   null,
				custom:     null,
			},
			{
				id:         2,
				name:       "Point radius",
				component:  "Config_ValueInt",
				value:      0,
				callback:   null,
				custom:     null,
			},
		],
	}),

	methods: {
		// handler
		Handler_editor() {
			ItemManager_setItem("Editor/component", [
				{
					name: "Editor_Title"
				},
				{
					name: "Editor_Dataset"
				},
				{
					name: "Editor_ValueConfig"
				},
			]);

			// editor
			ItemManager_setItem("Editor/enable", true);

			// editor - dataset
			ItemManager_setItem("Editor/Dataset/id_observer", this.id_observer);

			// editor - title
			ItemManager_setItem("Editor/Title/data", this.text_title);
			ItemManager_clearCallback("Editor/Title/hook_update");
			ItemManager_addCallback("Editor/Title/hook_update", this.Hook_updateTitle, false);

			// editor - value config
			ItemManager_setItem("Editor/ValueConfig/data", this.value_config_list);
			ItemManager_clearCallback("Editor/ValueConfig/hook_update");
			ItemManager_addCallback("Editor/ValueConfig/hook_update", this.Hook_updateValue, false);
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
				borderWidth:      1,
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

		// hook - widget control
		// assumed that the widget is created before this component is created
		Hook_WidgetControl_configWidget(widget) {
			if (widget == null) return;

			// check data.custom.component_line
			if (widget.custom["component_line"] !== undefined) {
				const custom = widget.custom["component_line"];

				this.text_title = custom.title;
				return;
			}

			// add new one
			widget.custom["component_line"] = {
				title: this.text_title,
			};
		},

		Hook_WidgetControl_updateWidget(widget) {
			if (widget == null) return;

			widget.custom["component_line"] = {
				title:  this.text_title,
			};
		},

		// hook - title, graph config
		Hook_updateTitle(title) {
			if (title == null) return;
			this.text_title = title;

			// set title to widget
			WidgetControl_configWidget(this.Interface_id, (widget) => {
				widget.name                         = title;
				widget.custom.component_line.title  = title;
			});
		},

		Hook_updateValue(data) {
			if (data == null) return;

			// get index
			const index = this.value_config_list.findIndex(element => element.id === data.id);
			if (index < 0) return;

			// get callback
			const callback = this.value_config_list[index].callback;
			if (callback == null) return;

			// run callback
			callback(data.value);
		},

		// internal
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
		},

		Internal_Graph_setLineThickness(thickness) {
			// get thickness: in float
			thickness = parseFloat(thickness);
			if (isNaN(thickness)) return;
			if (thickness <= 0)   return;

			// set thickness of line
			// TODO: currently the thickness of every line is the same
			for (let i = 0; i < this.dataset.length; ++i) {
				this.dataset[i].borderWidth = thickness;
			}

			// update graph
			this.Internal_updateGraph();
		},

		Internal_Graph_setLineFill(is_fill) {
			// set is fill of line
			// TODO: currently the config on every line is the same
			for (let i = 0; i < this.dataset.length; ++i) {
				this.dataset[i].fill = is_fill;
			}

			// update graph
			this.Internal_updateGraph();
		},

		Internal_Graph_setPointRadius(radius) {
			// get radius: in float
			radius = parseFloat(radius)
			if (isNaN(radius))  return;
			if (radius < 0)     return;

			// set radius of point
			this.chart_option[0].elements.point.radius = radius;

			// update graph
			this.Internal_updateGraph();
		}
	},

	mounted() {
		// value config list
		this.value_config_list[0].callback = this.Internal_Graph_setLineThickness;
		this.value_config_list[1].callback = this.Internal_Graph_setLineFill;
		this.value_config_list[2].callback = this.Internal_Graph_setPointRadius;

		// update graph
		const option = {
			scales: {
				yAxes: [{
					display: true,
					ticks: {
						fontColor: "#C6C8CA",
						fontSize: 10,
						min: 0,
						padding: 5
					},
					gridLines: {
						zeroLineColor: "white"
					},
					scaleLabel: {
						display: true
					}
				}],
				xAxes: [{
					display: true,
					ticks: {
						fontColor: "#C6C8CA",
						fontSize: 10,
						padding: 5
					},
					gridLines: {
						color: "transparent",
						zeroLineColor: "white"
					},
					scaleLabel: {
						display: true
					}
				}]
			},
			elements: {
				point:{
					radius: 0
				}
			},
			legend: {
				labels: {
					fontColor: "#C6C8CA",
				},
				display: true
			},
			animation: {
				duration: 1
			},
			tooltips: {
				enabled: true
			},
			maintainAspectRatio: false,
			responsive: true
		};
		this.chart_option.splice(0, 1, option);
		this.Internal_updateGraph();

		// observer
		this.id_observer = Observer_LogData_create();
		Observer_LogData_addCallback_Add(				this.id_observer, this.Hook_Observer_addData);
		Observer_LogData_addCallback_Rm(				this.id_observer, this.Hook_Observer_rmData);
		Observer_LogData_addCallback_Config(		this.id_observer, this.Hook_Observer_configData);

		// widget control
		WidgetControl_addCallback_RefreshWidget_Single(this.Interface_id, this.Hook_WidgetControl_updateWidget);
		WidgetControl_addCallback_ConfigWidget_Single(this.Interface_id, this.Hook_WidgetControl_configWidget);
		WidgetControl_updateWidget(this.Interface_id, false);
	},

	watch: {
		Interface_id: function (new_val, old_val) {
		}
	}
}
</script>


<style scoped>
</style>
