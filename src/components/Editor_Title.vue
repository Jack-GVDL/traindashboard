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
	ItemManager_setItem
} from "@/utility/ItemManager";


export default {
	name: "Editor_Title",

	data: () => ({
		text_title:       "",
		text_title_prev:  "",
	}),

	methods: {
		Handler_setTitle(is_require_blur=false) {
			// update hook
			// but compare with previous version to check if something is changed or not
			if (this.text_title === this.text_title_prev) return;
			this.text_title_prev = this.text_title;
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
