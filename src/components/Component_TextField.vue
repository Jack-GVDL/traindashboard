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
			class="white--text text-body-1 font-weight-light"
			v-for="item in text_data_list"
		>
			{{ item }}
		</div>
	</div>
</template>


<script>
import {ItemManager_addCallback, ItemManager_clearCallback, ItemManager_setItem} from "@/utility/ItemManager";

export default {
	name: "Component_TextField",

	data:() => ({
		// title, editor
		text_title: "",

		// text field
		text_data: "",
		text_data_list: [],

		// editor info
		value_config_list: [
			{
				id:         0,
				name:       "Text",
				component:  "Config_TextField",
				value:      "",
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
					name: "Editor_ValueConfig"
				},
			]);

			// editor
			ItemManager_setItem("Editor/enable", true);

			// editor - title
			ItemManager_setItem("Editor/Title/data", this.text_title);
			ItemManager_clearCallback("Editor/Title/hook_update");
			ItemManager_addCallback("Editor/Title/hook_update", this.Hook_updateTitle, false);

			// editor - value config
			this.value_config_list[0].value = this.text_data;

			ItemManager_setItem("Editor/ValueConfig/data", this.value_config_list);
			ItemManager_clearCallback("Editor/ValueConfig/hook_update");
			ItemManager_addCallback("Editor/ValueConfig/hook_update", this.Hook_updateValue, false);
		},

		// hook - editor
		Hook_updateTitle(title) {
			if (title == null) return;
			this.text_title = title;
		},

		Hook_updateValue(data) {
			if (data == null) return;
			this.text_data = data.value;
			this.Internal_updateData();
		},

		// internal
		Internal_updateData() {
			// clear
			while (this.text_data_list.length !== 0) this.text_data_list.pop();

			let cur = "";
			for (let i = 0; i < this.text_data.length; ++i) {
				if (this.text_data[i] !== '\n') {
					cur += this.text_data[i];
					continue;
				}

				this.text_data_list.push(cur);
				cur = "";
			}

			// final one
			this.text_data_list.push(cur);
		},
	},

	mounted() {
	},

	watch: {
	}
};
</script>


<style scoped>
</style>
