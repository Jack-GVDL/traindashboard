<template>
	<v-container>

		<div class="white--text text-h6 font-weight-light">
			Title
		</div>

		<v-text-field
				ref="text_field_title"
				v-model="text_title"
				class="font-weight-light"
				@blur="Handler_setTitle()"
				@keydown.enter="Handler_setTitle(true)"
		>
		</v-text-field>

	</v-container>
</template>


<script>
import {
	ItemManager_addCallback,
	ItemManager_setItem} from "@/utility/ItemManager";


export default {
	name: "Editor_Title",

	data: () => ({
		text_title: ""
	}),

	methods: {
		Handler_setTitle(is_require_blur=false) {
			// update hook
			ItemManager_setItem("Editor/Title/hook_update", this.text_title);

			// blur text field
			if (is_require_blur) this.$refs.text_field_title.blur();
		},

		Hook_setData(data) {
			this.text_title = data;
		}
	},

	mounted() {
		// item manager
		ItemManager_addCallback("Editor/Title/data", this.Hook_setData);
	}
}
</script>


<style scoped>
</style>
