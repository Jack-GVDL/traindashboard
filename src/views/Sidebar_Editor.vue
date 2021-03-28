<template>
	<v-navigation-drawer
		v-model="is_enable"
		class="background_panel"
		width="50vh"
		dark
		absolute
		right
	>
		<div class="my-1 mx-1 d-flex justify-end">
			<v-btn
					@click="Handler_close()"
					class="elevation-0 text-h6 font-weight-light"
					color="transparent"
					dark
			>
				Close
			</v-btn>
		</div>

		<div v-for="item in component_list">
			<div :is="item.name"></div>
		</div>
	</v-navigation-drawer>
</template>


<script>
import {
	ItemManager_addCallback,
	ItemManager_setItem
} from "@/utility/ItemManager";
import Editor_Dataset from "@/components/Editor_Dataset";
import Editor_Title from "@/components/Editor_Title";
import Editor_ValueConfig from "@/components/Editor_ValueConfig";


export default {
	name: "Sidebar_Editor",

	components: {
		Editor_Dataset,
		Editor_Title,
		Editor_ValueConfig
	},

	data: () => ({
		is_enable: false,
		component_list: []
	}),

	methods: {
		Handler_close() {
			this.is_enable = false;
		},

		Hook_enableEditor(data) {
			this.is_enable = data;
		},

		Hook_setComponentList(data) {
			this.component_list = data;
		}
	},

	mounted() {
		ItemManager_setItem("Editor/enable", this.is_enable);
		ItemManager_addCallback("Editor/enable", this.Hook_enableEditor);
		ItemManager_addCallback("Editor/component", this.Hook_setComponentList);
	}
}
</script>


<style scoped>
</style>
