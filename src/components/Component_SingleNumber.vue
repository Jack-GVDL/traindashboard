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
			ItemManager_addCallback("Editor/Title/hook_update", this.Hook_updateTitle);
		},

		Hook_updateTitle(title) {
			if (title == null) return;
			this.text_title = title;
		},

		Hook_Observer_addData(data) {
			if (data == null) return;
			this.text_value =
				data.log_data.data.length === 0 ? "---" : data.log_data.data[0].toFixed(2);
		},

		Hook_Observer_rmData(data) {
			if (data == null) return;
			this.text_value = "---";
		},

		Hook_Observer_configData(data) {
			if (data == null) return;
			this.text_value =
				data.log_data.data.length === 0 ? "---" : data.log_data.data[0].toFixed(2);
		},
	},

	mounted() {
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
