<template>
	<div>

		<v-simple-table
				style="background-color: #43485a;"
				dense
		>
			<template v-slot:default>

				<thead>
					<tr>
						<th
								v-for="item_header in header_list"
						>{{ item_header.text }}</th>
					</tr>
				</thead>
				<tbody>
					<tr
							v-for="item in item_list"
					>
						<td
								class="d-flex align-center"
						>
							<v-checkbox
									class=""
									v-model="item.is_selected"
									@click="Handler_selectData(item.id, item.is_selected);"
							>
							</v-checkbox>
						</td>
						<td
							style="padding: 0;"
						>{{ item.name }}</td>
					</tr>
				</tbody>

			</template>
		</v-simple-table>

	</div>
</template>


<script>
import {
	Server_addCallback_IDNameList,
	Server_update_IDNameList
} from "@/utility/Server_Data";

import {
	ItemManager_addCallback
} from "@/utility/ItemManager";

import {
	Observer_LogData_addCallback_Add,
	Observer_LogData_addCallback_Config,
	Observer_LogData_addCallback_Rm,
	Observer_LogData_bindData,
	Observer_LogData_getData,
	Observer_LogData_rmCallback_Add,
	Observer_LogData_rmCallback_Config,
	Observer_LogData_rmCallback_Rm,
	Observer_LogData_unbindData
} from "@/utility/Observer_LogData";


export default {
	name: "Editor_LogData",

	data:() => ({
		// observer
		id_observer: -1,

		// table
		item_list: 		[],
		header_list:	[],
	}),

	methods: {
		Handler_selectData(id, is_selected) {
			// set the checkbox to be not_selected
			const index = this.item_list.findIndex(element => element.id === id);
			if (index >= 0) this.item_list[index].is_selected = false;

			// bind / unbind data
			if (is_selected)	Observer_LogData_bindData(	this.id_observer, id);
			else							Observer_LogData_unbindData(this.id_observer, id);
		},

		Hook_updateLogData_IDNameList(data) {
			if (data == null) return;

			// clear previous data
			while (this.item_list.length !== 0) this.item_list.pop();

			// add new data
			for (let i = 0; i < data.length; ++i) {
				this.item_list.push({
					id: 					data[i][0],
					name: 				data[i][1],
					is_selected: 	false
				});
			}
		},

		Hook_setObserver(id_observer) {
			// check if the observer is changed or not
			if (id_observer === this.id_observer) return;

			// reset is_selected
			for (let i = 0; i < this.item_list.length; ++i) {
				this.item_list[i].is_selected = false;
			}

			// set is selected based on the observer
			const data_list = Observer_LogData_getData(id_observer);

			for (let i = 0; i < data_list.length; ++i) {
				const item 	= data_list[i];
				const index = this.item_list.findIndex(element => element.id === item.log_data.id);

				// although index < 0 should not happen
				if (index < 0) continue;

				this.item_list[index].is_selected = true;
			}

			// set observer that under control
			const prev_id_observer 	= this.id_observer;
			this.id_observer 				= id_observer;

			// reset callback connection
			Observer_LogData_rmCallback_Add(		prev_id_observer, this.Hook_Observer_add);
			Observer_LogData_rmCallback_Rm(			prev_id_observer, this.Hook_Observer_rm);
			Observer_LogData_rmCallback_Config(	prev_id_observer, this.Hook_Observer_config);

			Observer_LogData_addCallback_Add(			id_observer, this.Hook_Observer_add);
			Observer_LogData_addCallback_Rm(			id_observer, this.Hook_Observer_rm);
			Observer_LogData_addCallback_Config(	id_observer, this.Hook_Observer_config);
		},

		Hook_Observer_add(data) {
			if (data == null) return;

			// get target item
			const index = this.item_list.findIndex(element => element.id === data.log_data.id);
			if (index < 0) return;

			// update item
			this.item_list[index].is_selected = true;
		},

		Hook_Observer_rm(data) {
			if (data == null) return;

			// get target item
			const index = this.item_list.findIndex(element => element.id === data.log_data.id);
			if (index < 0) return;

			// update item
			this.item_list[index].is_selected = false;
		},

		// Hook_Observer_config(data) {
		// 	if (data == null) return;
		// },

		// internal
		Internal_addHeader(text, value) {
			this.header_list.push({
				"text": 		text,
				"value": 		value,
				"sortable": false,
			});
		},
	},

	mounted() {
		// data table
		this.Internal_addHeader("Is Selected", "is_selected");
		this.Internal_addHeader("Data", "name")

		// server
		Server_addCallback_IDNameList(this.Hook_updateLogData_IDNameList);
		Server_update_IDNameList();

		// item manager
		ItemManager_addCallback("Editor/LogData/id_observer", this.Hook_setObserver);
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
