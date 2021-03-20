<template>
	<v-container>

		<div class="white--text text-h6 font-weight-light">
			Dataset
		</div>

		<div class="my-2"></div>

		<div class="d-flex justify-end">
			<v-btn
					@click="Handler_enableEditor_LogData();"
					class="background_panel_lighten_1 elevation-0"
					color="transparent"
			>
				<v-icon
					x-small
				>
					mdi-cog
				</v-icon>
				<div
						style="text-transform: none;"
						class="mx-2 text-body-2"
				>
					Config Dataset
				</div>
			</v-btn>
		</div>

		<div
			class="my-1"
		></div>

		<div
			v-show="is_show_log_data"
		>
			<Editor_LogData/>
		</div>

		<!-- data table -->
		<v-data-table
				v-show="!is_show_log_data"
				:headers="header_list"
				:items="item_list"
				class="background_panel_lighten_1 elevation-0 font-weight-light"
				hide-default-footer
				dense
		>

			<!-- name -->
			<template
					v-slot:item.name="{ item }"
			>
				<div
						v-show="!item.is_edit_name"
						class="font-weight-light"
						@dblclick="Handler_enableEditor_Name(item)"
				>
					{{ item.name }}
				</div>
				<v-text-field
						:ref="item.id"
						v-model="item.name"
						v-show="item.is_edit_name"
						@blur="Handler_disableEditor_Name(item)"
						@keydown.enter="Handler_disableEditor_Name(item)"
						class="font-weight-light"
				>
				</v-text-field>
			</template>
			<!-- name -->

			<!-- color -->
			<template v-slot:item.color="{ item }">
				<v-menu
						v-model="item.is_edit_color"
						offset-x
						:close-on-content-click="false"
						:close-on-click="false"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
								@click="Handler_enableEditor_Color(item)"
								:style="'background-color:' + item.color + ';'"
								icon
								dark
								x-small
								:color="item.color"
						>
						</v-btn>
					</template>

					<!-- color picker -->
					<v-card>
						<v-color-picker
								mode.sync="rgba"
								v-model="item.rgba_color"
								dot-size="30"
								dark
						>
						</v-color-picker>

						<div
							class="d-flex justify-end"
						>
							<v-btn
									@click="Handler_disableEditor_Color(item, false)"
									dark
							>
								Close
							</v-btn>
							<v-btn
									@click="Handler_disableEditor_Color(item, true)"
									dark
							>
								Save
							</v-btn>
						</div>
					</v-card>
					<!-- color picker -->

				</v-menu>
			</template>
			<!-- color -->

		</v-data-table>
		<!-- data table -->

	</v-container>
</template>


<script>
import {
	ItemManager_addCallback,
	ItemManager_setItem,
	ItemManager_updateItem
} from "@/utility/ItemManager";
import Editor_LogData from "@/components/Editor_LogData";
import {
	Observer_LogData_addCallback_Add,
	Observer_LogData_addCallback_Config,
	Observer_LogData_addCallback_Rm,
	Observer_LogData_configCustom,
	Observer_LogData_getData,
	Observer_LogData_rmCallback_Add,
	Observer_LogData_rmCallback_Config,
	Observer_LogData_rmCallback_Rm
} from "@/utility/Observer_LogData";


export default {
	name: "Editor_Dataset",

	components: {
		Editor_LogData
	},

	data: () => ({
		// dataset
		header_list: 		[],
		item_list: 			[],
		id_observer: 		-1,

		// log data editor
		is_show_log_data: false,

		// data table
		dataset: [],

		is_editing_name:	false,
		is_editing_color: false,

		edit_id: -1,
	}),

	methods: {
		// log data
		Handler_enableEditor_LogData() {
			this.is_show_log_data = !this.is_show_log_data;

			// enable editor - log data
			// ItemManager_setItem(
			// 		"Editor/LogData/id_observer",
			// 		this.id_observer
			// );
		},

		// Handler_disableEditor_LogData() {
		// 	this.is_show_log_data = false;
		// },

		// name
		Handler_enableEditor_Name(item) {
			// avoid showing multiple text field at the same time
			if (this.is_editing_name) return;
			this.is_editing_name 	= true;
			this.edit_id 					= item.id;

			// display
			item.is_edit_name = true;
			this.$refs[this.edit_id].focus();
		},

		Handler_disableEditor_Name(item) {
			// avoid showing multiple text field at the same time
			if (!this.is_editing_name) 			return;
			if (item.id !== this.edit_id) 	return;
			this.is_editing_name 	= false;
			this.edit_id 					= null;

			// display
			item.is_edit_name = false;

			// config observer
			Observer_LogData_configCustom(
					this.id_observer,
					item.id,
					(custom) => {
						custom.label = item.name;
						return custom;
					}
			)
		},

		// color
		Handler_enableEditor_Color(item) {
			if (this.is_editing_color) return;
			this.is_editing_color = true;

			item.is_edit_color = true;
		},

		Handler_disableEditor_Color(item, is_save) {
			// hide menu (color picker)
			this.is_editing_color = false;
			item.is_edit_color = false;

			// save configuration (update to observer)
			if (!is_save) return;

			Observer_LogData_configCustom(
					this.id_observer,
					item.id,
					(custom) => {
						custom.rgba_color = item.rgba_color;
						return custom;
					}
			);
		},

		// hook
		Hook_setObserver(id_observer) {
			// check if the observer is changed or not
			if (id_observer === this.id_observer) return;

			// clear
			while (this.item_list.length !== 0) this.item_list.pop();

			// get data list
			const data_list = Observer_LogData_getData(id_observer);

			// add
			for (let i = 0; i < data_list.length; ++i) {
				const item = data_list[i];
				this.Internal_addItem(
						item.log_data.id,
						item.custom.label,
						item.log_data.data.length,
						item.custom.rgba_color
				);
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

			// editor - log data
			ItemManager_setItem(
					"Editor/LogData/id_observer",
					this.id_observer
			);
		},

		Hook_Observer_add(data) {
			if (data == null) return;

			// add item
			this.Internal_addItem(
					data.log_data.id,
					data.custom.label,
					data.log_data.data.length,
					data.custom.rgba_color
			);
		},

		Hook_Observer_rm(data) {
			if (data == null) return;

			// get index
			const index = this.item_list.findIndex(element => element.id === data.log_data.id);
			if (index < 0) return;

			// remove the target item
			this.item_list.splice(index, 1);
		},

		Hook_Observer_config(data) {
			if (data == null) return;

			// get index
			const index = this.item_list.findIndex(element => element.id === data.log_data.id);
			if (index < 0) return;

			// update the target item
			const color = data.custom.rgba_color;

			this.item_list.splice(
					index,
					1,
					{
						id: 						data.log_data.id,

						name:						data.custom.label,
						length:					data.log_data.data.length,
						color:					"rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a +")",
						rgba_color:			color,

						is_edit_name:		false,
						is_edit_color:	false
					}
			);
		},

		// internal
		Internal_addItem(id, name, length, color) {
			const item = {
				id: 						id,

				name:						name,
				length:					length,
				color:					"rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a +")",
				rgba_color:			color,

				is_edit_name:		false,
				is_edit_color:	false
			};

			this.item_list.push(item);
		},

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
		this.Internal_addHeader("Name", "name");
		this.Internal_addHeader("Data Length", "length");
		this.Internal_addHeader("Color", "color");

		// item manager
		ItemManager_addCallback("Editor/Dataset/id_observer", this.Hook_setObserver);
	}
}
</script>


<style scoped>
.background_back {
	background-color: #12161f;
}

.background_panel_darken_1 {
	background-color: #1c212c;
}

.background_panel {
	background-color: #2e3442;
}

.background_panel_lighten_1 {
	background-color: #43485a;
}
</style>
