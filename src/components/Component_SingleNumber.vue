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

		<div
			style="height: 20%;"
		>
		</div>

		<!-- number -->
		<div
			class="d-flex justify-center"
		>
			<div
				class="white--text text-h3 font-weight-light"
			>
				{{ text_value }}
			</div>
		</div>
		<!-- number -->

	</div>
</template>


<script>
import {
	ItemManager_addCallback,
	ItemManager_clearCallback,
	ItemManager_setItem
} from "@/utility/ItemManager";

import {
	Observer_LogData_addCallback_Add,
	Observer_LogData_addCallback_Config,
	Observer_LogData_addCallback_Rm,
	Observer_LogData_create, Observer_LogData_setSizeMax
} from "@/utility/Observer_LogData"


export default {
	name: "Component_SingleNumber",

	components: {
	},

	data: () => ({
		// observer
		id_observer: -1,

		// number
		text_value: "---",

		// title, editor
		text_title: "",

		// editor info
		value_config_list: [
			{
				id:         0,
				name:       "Number Handling",
				component:  "Config_ValueSelect",
				value:      "First",
				callback:   null,
				custom:     ["First", "Last", "Average", "Sum", "Low", "High"],
			},
		],

		// data cache
		data_first:   "---",
		data_last:    "---",
		data_sum:     "---",
		data_average: "---",
		data_high:    "---",
		data_low:     "---",

		data_mode:    0,
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

		// hook - observer
		Hook_Observer_addData(data) {
			if (data == null) return;
			this.Internal_setData(data);
			this.Internal_updateData();

		},

		Hook_Observer_rmData(data) {
			if (data == null) return;

			this.data_first   = "---";
			this.data_last    = "---";
			this.data_average = "---";
			this.data_sum     = "---";
			this.data_high    = "---";
			this.data_low     = "---";

			this.text_value   = "---";
		},

		Hook_Observer_configData(data) {
			if (data == null) return;
			this.Internal_setData(data);
			this.Internal_updateData();
		},

		// hook - editor
		Hook_updateTitle(title) {
			if (title == null) return;
			this.text_title = title;
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
		Internal_setData(data) {
			this.data_first   = "---";
			this.data_last    = "---";
			this.data_average = "---";
			this.data_sum     = "---";
			this.data_high    = "---";
			this.data_low     = "---";

			if (data.log_data.data.length !== 0) {
				const n = data.log_data.data.length;

				this.data_first   = data.log_data.data[0].toFixed(2);
				this.data_last    = data.log_data.data[n - 1].toFixed(2);

				let value_high   = data.log_data.data[0];
				let value_low    = data.log_data.data[0];

				let sum = 0;
				for (let i = 0; i < n; ++i) {
					sum += data.log_data.data[i];

					value_high = data.log_data.data[i] > value_high ? data.log_data.data[i] : value_high;
					value_low  = data.log_data.data[i] < value_low ? data.log_data.data[i] : value_low;
				}

				this.data_sum     = sum.toFixed(2);
				this.data_average = (sum / n).toFixed(2);

				this.data_high  = value_high.toFixed(2);
				this.data_low   = value_low.toFixed(2);
			}
		},

		Internal_updateData() {
			const table = [
				this.data_first,
				this.data_last,
				this.data_sum,
				this.data_average,
				this.data_low,
				this.data_high,
			];

			this.text_value = table[this.data_mode];
		},

		Internal_setMode(mode) {
			const table = [
				"First",
				"Last",
				"Sum",
				"Average",
				"Low",
				"High"
			];

			const index = table.findIndex(element => element === mode);
			if (index < 0) return;

			this.data_mode = index;
			this.Internal_updateData();
		},
	},

	mounted() {
		// value config list
		this.value_config_list[0].callback = this.Internal_setMode;

		// observer
		this.id_observer = Observer_LogData_create();
		Observer_LogData_setSizeMax(this.id_observer, 1n);

		Observer_LogData_addCallback_Add(     this.id_observer, this.Hook_Observer_addData);
		Observer_LogData_addCallback_Rm(      this.id_observer, this.Hook_Observer_rmData);
		Observer_LogData_addCallback_Config(  this.id_observer, this.Hook_Observer_configData);
	},
}
</script>


<style scoped>

</style>
