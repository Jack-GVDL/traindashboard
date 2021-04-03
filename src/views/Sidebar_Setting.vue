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
					class="py-0 white--text text-body-2 font-weight-light"
				>
					{{ item.name }}
				</v-col>
				<!-- config name -->

				<!-- config item -->
				<v-col
					class="py-0 d-flex justify-end"
				>

					<!-- value int -->
					<div
						v-show="item.is_show"
						v-if="item.component === 'Config_ValueString'"
						class="py-0 my-0"
					>
						<v-text-field
							v-model="item.value"
							:disabled="!item.is_enable"
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
					<div
						v-show="item.is_show"
						v-if="item.component === 'Config_ValueBool'"
					>
						<v-checkbox
							:disabled="!item.is_enable"
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
						v-show="item.is_show"
						v-if="item.component === 'Config_ValueSelect'"
					>
						<v-select
							class="white--text font-weight-light"
							v-model="item.value"
							:disabled="!item.is_enable"
							dense
							dark
							:items="item.custom"
							@change="Handler_setValue(item.id)"
						>
						</v-select>
					</div>
					<!-- value select -->

				</v-col>
				<!-- config item -->

			</v-row>

			<v-spacer></v-spacer>

			<v-row>
				<v-col>
					<v-spacer></v-spacer>

					<v-btn
						@click="Handler_reload()"
						class="red--text text-body-1 font-weight-light"
						dark
						color="transparent"
						elevation="0"

					>
						Reload
					</v-btn>
				</v-col>
			</v-row>

		</v-container>
	</v-navigation-drawer>
</template>


<script>
import {
	ItemManager_addCallback,
	ItemManager_setItem
} from "@/utility/ItemManager";
import {
	Server_getAddress
} from "@/utility/Server_Data";
import {
	Electron_reload,
	Electron_setFullScreen
} from "@/utility/ElectronControl";


export default {
	name: "Sidebar_Setting",

	components: {
	},

	data:() => ({
		// sidebar
		is_enable: false,

		// setting item
		item_list: [
			{
				id:         0,
				name:       "Data Server",
				component:  "Config_ValueString",
				value:      "",
				callback:   null,
				custom:     null,
				is_enable:  true,
				is_show:    true,
			},
			{
				id:         0,
				name:       "Layout Server",
				component:  "Config_ValueString",
				value:      "",
				callback:   null,
				custom:     null,
				is_enable:  true,
				is_show:    true,
			},
			{
				id:         0,
				name:       "Full Screen",
				component:  "Config_ValueBool",
				value:      "",
				callback:   null,
				custom:     null,
				is_enable:  true,
				is_show:    true,
			}
		],

		// electron
		is_full_screen: false,
	}),

	methods: {
		// handler
		Handler_close() {
			this.is_enable = false;
		},

		Handler_reload() {
			Electron_reload();
		},

		Handler_setValue(id) {
			const index = this.item_list.findIndex(element => element.id === id);
			if (index < 0) return;

			const callback = this.item_list[index].callback;
			if (callback == null) return;

			callback(this.item_list[index].value, this.item_list[index].custom);
		},

		// hook
		Hook_enable(data) {
			this.is_enable = data;
		},

		Hook_toggleFullScreen(data) {
			if (data == null) return
			Electron_setFullScreen(data);
		},
	},

	mounted() {
		// item list
		// assign id
		for (let i = 0; i < this.item_list.length; ++i) {
			this.item_list[i].id = i;
		}

		// config per item
		this.item_list[0].value = Server_getAddress();
		this.item_list[0].is_enable = false;

		this.item_list[1].is_enable = false;

		this.item_list[2].callback = this.Hook_toggleFullScreen;

		// item manager
		ItemManager_setItem("Setting/enable", this.is_enable);
		ItemManager_addCallback("Setting/enable", this.Hook_enable);
	},

	watch: {
	}
};
</script>


<style scoped>
</style>
