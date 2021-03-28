<template>
	<v-container>

		<div class="white--text text-h6 font-weight-light">
			Value Config
		</div>

		<div
			class="py-2"
		>
		</div>

		<v-container>
			<v-row
				v-for="item in item_list"
				class="d-flex align-center"
			>

				<!-- config name -->
				<v-col
					class="col-4 py-0 white--text text-body-2 font-weight-light"
				>
					{{ item.name }}
				</v-col>
				<!-- config name -->

				<!-- config item -->
				<v-col
					class="col-8 py-0 d-flex justify-end"
				>

					<!-- value int -->
					<div
						v-if="item.component === 'Config_ValueInt'"
						class="py-0 my-0"
					>
						<v-text-field
							v-model="item.value"
							class="py-0 my-0 text-body-1 font-weight-light"
							dense
							reverse
							@blur="Handler_setValue(item.id)"
							@keydown.enter="Handler_setValue(item.id)"
						>
						</v-text-field>
					</div>
					<!-- value int -->

					<!-- value bool -->
					<div v-if="item.component === 'Config_ValueBool'">
						<v-checkbox
							v-model="item.value"
							dense
							@change="Handler_setValue(item.id)"
						>
						</v-checkbox>
					</div>
					<!-- value bool -->

					<!-- value select -->
					<div
						class="white--text"
						v-if="item.component === 'Config_ValueSelect'"
					>
						<v-select
							class="white--text font-weight-light"
							v-model="item.value"
							dense
							dark
							:items="item.custom"
							@change="Handler_setValue(item.id)"
						>
						</v-select>
					</div>
					<!-- value select -->

					<!-- text area -->
					<div
						style="width: 100%;"
						class="white--text"
						v-if="item.component === 'Config_TextField'"
					>
						<v-textarea
							v-model="item.value"
							auto-grow
							@blur="Handler_setValue(item.id)"
							@keydown.enter="Handler_setValue(item.id)"
						>
						</v-textarea>
					</div>
					<!-- text area -->

					<!-- item list -->
					<div
						style="width: 100%;"
						class="white--text"
						v-if="item.component === 'Config_ItemList'"
					>
						<div
							class="d-flex justify-end"
						>
							<v-btn
								@click="Handler_ItemList_addItem(item.id)"
								icon
							>
								<v-icon>
									mdi-plus
								</v-icon>
							</v-btn>
						</div>

						<v-list>
							<v-list-item
								v-for="data in item.value.list"
							>

								<div
									style="width: 100%;"
									class="d-flex justify-space-between align-center"
								>
									<v-text-field
										class="white--text font-weight-light"
										v-model="data.value"
										dark
										dense
										@blur="Handler_ItemList_setItem(item.id, data.id, data.value);"
										@keydown.enter="Handler_ItemList_setItem(item.id, data.id, data.value);"
									>
									</v-text-field>

									<div
										class="d-flex justify-end"
									>
										<v-btn
											@click="Handler_ItemList_rmItem(item.id, data.id)"
											icon
										>
											<v-icon>
												mdi-minus
											</v-icon>
										</v-btn>
									</div>
								</div>

							</v-list-item>
						</v-list>
					</div>
					<!-- item list -->

				</v-col>
				<!-- config item -->

			</v-row>
		</v-container>

	</v-container>
</template>


<script>
import {
	ItemManager_addCallback,
	ItemManager_setItem
} from "@/utility/ItemManager";


export default {
	name: "Editor_ValueConfig",

	data:() => ({
		item_list: [],
	}),

	methods: {
		// handler
		Handler_setValue(id) {
			// get index
			const index = this.item_list.findIndex(element => element.id === id);
			if (index < 0) return;

			// send signal
			ItemManager_setItem("Editor/ValueConfig/hook_update", {
				id:     id,
				value:  this.item_list[index].value,
			});
		},

		Handler_ItemList_addItem(id) {
			// get index
			const index = this.item_list.findIndex(element => element.id === id);
			if (index < 0) return;

			// add item
			this.item_list[index].value.list.push({
				id:     this.item_list[index].value.index,
				value:  ""
			});

			this.item_list[index].value.index++;

			// update
			this.Handler_setValue(id);
		},

		Handler_ItemList_rmItem(id_item, id_data) {
			// get index
			const index_item = this.item_list.findIndex(element => element.id === id_item);
			if (index_item < 0) return;

			const index_data = this.item_list[index_item].value.list.findIndex(element => element.id === id_data);
			if (index_data < 0) return;

			// rm item
			this.item_list[index_item].value.list.splice(index_data, 1);

			// update
			this.Handler_setValue(id_item);
		},

		Handler_ItemList_setItem(id_item, id_data, value) {
			// get index
			const index_item = this.item_list.findIndex(element => element.id === id_item);
			if (index_item < 0) return;

			const index_data = this.item_list[index_item].value.list.findIndex(element => element.id === id_data);
			if (index_data < 0) return;

			// set item
			// const item = this.item_list[index_item].value.list[index_data];
			// item.value = value;
			// this.item_list[index_item].value.list.splice(index_data, 1, item);

			// update
			this.Handler_setValue(id_item);
		},

		// hook
		Hook_setData(data) {
			if (data == null) return;

			// clear previous list
			// this.item_list.splice(0, this.item_list.length);
			while (this.item_list.length !== 0) this.item_list.pop();

			// add new data
			for (let i = 0; i < data.length; ++i) {
				this.item_list.push({
					id:           data[i].id,
					name:         data[i].name,
					component:    data[i].component,
					value:        data[i].value,
					custom:       data[i].custom,
				})
			}
		}
	},

	mounted() {
		// item manager
		ItemManager_addCallback("Editor/ValueConfig/data", this.Hook_setData);
	},

	watch: {
	}
};
</script>


<style scoped>
.v-select-list {
	background: rgba(100, 115, 130, 0.9);
	backdrop-filter: blur(8px);
}

.v-list-item__title {
	color: white;
}
</style>


<style>
.v-list-item__title {
	color: white;
}
</style>
