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
			class="py-2"
		>
		</div>

		<div>
			<ul>
				<li
					class="white--text text-body-1 font-weight-light"
					v-for="item in item_list.list"
				>
					{{ item.value }}
				</li>
			</ul>
		</div>

	</div>
</template>


<script>
import {
	ItemManager_addCallback,
	ItemManager_clearCallback,
	ItemManager_setItem
} from "@/utility/ItemManager";
import {
	WidgetControl_configWidget
} from "@/utility/WidgetControl";


export default {
	name: "Component_ItemList",

	props: [
		"Interface_id",
	],

	data:() => ({
		// title, editor
		text_title: "",

		// item list
		item_list: {
			list: [],
			index: 0,
		},

		// editor info
		value_config_list: [
			{
				id:         0,
				name:       "Item List",
				component:  "Config_ItemList",
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

			// copy item_list (deep copy)
			const temp_list = [];
			for (let i = 0; i < this.item_list.list.length; ++i) {
				const item = this.item_list.list[i];
				temp_list.push({
					id:     item.id,
					value:  item.value,
				});
			}

			this.value_config_list[0].value = {
				list:   temp_list,
				index:  this.item_list.index,
			};

			// editor - value config
			ItemManager_setItem("Editor/ValueConfig/data", this.value_config_list);
			ItemManager_clearCallback("Editor/ValueConfig/hook_update");
			ItemManager_addCallback("Editor/ValueConfig/hook_update", this.Hook_updateValue, false);
		},

		// hook - editor
		Hook_updateTitle(title) {
			if (title == null) return;
			this.text_title = title;

			// set title to widget
			WidgetControl_configWidget(this.Interface_id, (widget) => widget.name = title);
		},

		Hook_updateValue(data) {
			if (data == null) return;

			// clear
			while (this.item_list.list.length !== 0) this.item_list.list.pop();

			// add
			const item_list = data.value.list;
			for (let i = 0; i < item_list.length; ++i) {
				this.item_list.list.push({
					id:     item_list[i].id,
					value:  item_list[i].value,
				});
			}
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
