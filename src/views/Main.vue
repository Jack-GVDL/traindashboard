<template>
	<div class="d-flex justify-start fill-height">

		<!-- sidebar -->
		<v-container
				style="width: 300px;"
				class="px-0 py-0"
				color="grey-lighten-3"
				permanent
		>
			<v-row
					style="width: 300px;"
					class="grow fill-height"
					no-gutters
			>

				<!-- drawer left -->
				<v-navigation-drawer
						class="background_panel_darken_1"
						dense
						mini-variant
						mini-variant-width="50"
						permanent
				>
					<div
						style="height: 100%;"
						class="d-flex flex-column justify-space-between align-center"
					>

						<!-- top button -->
						<v-container>
							<v-row
								class="py-2"
							>
							</v-row>

							<v-row
								class="py-1 d-flex justify-center"
							>
								<v-btn
									icon
									color="white"
								>
									<v-icon>mdi-plus</v-icon>
								</v-btn>
							</v-row>

							<v-row
								class="py-1 d-flex justify-center"
							>
								<v-btn
									icon
									color="white"
								>
									<v-icon>mdi-plus</v-icon>
								</v-btn>
							</v-row>
						</v-container>
						<!-- top button -->

						<!-- bottom button -->
						<div>
							<v-btn
								@click="Handler_enableSetting()"
								icon
								color="white"
							>
								<v-icon>mdi-cog</v-icon>
							</v-btn>

							<div
								class="py-2"
							>
							</div>
						</div>
						<!-- bottom button -->

					</div>
				</v-navigation-drawer>
				<!-- drawer left -->

				<!-- drawer right -->
				<v-navigation-drawer
						class="background_panel"
						width="250"
						permanent
				>
					<div style="height: 20px;"></div>

					<!-- list control -->
					<div class="px-2 d-flex justify-end">
						<v-menu offset-y>

							<!-- menu enable button -->
							<template
								class="d-flex align-center"
								v-slot:activator="{ on, attr }"
							>
								<div
									class="white--text text-body-2 font-weight-light"
								>
									{{ widget_sort_text }}

									<v-btn
										dark
										icon
										v-bind="attr"
										v-on="on"
										small
									>
										<v-icon
											color="white"
											small
										>
											mdi-cog
										</v-icon>
									</v-btn>
								</div>
							</template>
							<!-- menu enable button -->

							<!-- menu list -->
							<v-list
								class="Main_opacity_1"
							>
								<v-list-item
									v-for="(item, index) in widget_sort_mode_list"
									@click="Handler_sortList(index)"
								>
									<div
										class="white--text font-weight-light text-body-2"
									>
										{{ item }}
									</div>
								</v-list-item>
							</v-list>
							<!-- menu list -->

						</v-menu>
					</div>
					<!-- list control -->

					<v-list
						dense
						height="90vh"
						expand
					>
						<v-list-item
								v-for="item in list_widget"
						>

							<v-list-group
									dense
									color="white"
							>
								<template
										v-slot:activator
										style="height: 20px;"
								>
									<v-list-item-icon>
										<v-icon
												color="white"
										>
											{{ item.icon }}
										</v-icon>
									</v-list-item-icon>

									<v-list-item-title
											class="white--text"
									>
										{{ item.name }}
									</v-list-item-title>
								</template>

								<v-list-item
										style="height: 20px;"
										@click="Handler_addWidget(temp)"
										v-for="temp in item.list"
										link
								>

									<v-list-item-avatar>
										<v-icon
												color="white"
												small
										>
											{{ temp.icon }}
										</v-icon>
									</v-list-item-avatar>

									<v-list-item-content
									>
										<v-list-item-title
												class="white--text font-weight-light"
										>
											{{ temp.name }}
										</v-list-item-title>
									</v-list-item-content>

								</v-list-item>
							</v-list-group>

						</v-list-item>
					</v-list>

				</v-navigation-drawer>
				<!-- drawer right -->

			</v-row>
		</v-container>
		<!-- sidebar -->

		<!-- dashboard -->
		<Dashboard/>
		<!-- dashboard -->

		<!-- sidebar - editor -->
		<Sidebar_Editor/>
		<!-- sidebar - editor -->

		<!-- sidebar - setting -->
		<Sidebar_Setting/>
		<!-- sidebar - setting -->

	</div>
</template>


<script>
import Dashboard from "@/views/Dashboard";
import Sidebar_Editor from "@/views/Sidebar_Editor";
import Sidebar_Setting from "@/views/Sidebar_Setting";
import {
	ItemManager_setItem,
} from "@/utility/ItemManager";
import {
	WidgetControl_addWidget
} from "@/utility/WidgetControl";


export default {
	name: "Main",

	components: {
		Sidebar_Setting,
		Sidebar_Editor,
		Dashboard
	},

	data: () => ({
		// sidebar
		list_widget: [
		],

		list_widget_graph: [
			{
				id:   -1,
				name: "Line Chart",
				icon: "",
				component: "Component_ChartLine"
			},
			{
				id:   -1,
				name: "Bar Chart",
				icon: "",
				component: "Component_ChartBar"
			},
			{
				id:   -1,
				name: "Pie Chart",
				icon: "",
				component: "Component_ChartPie"
			}
		],

		list_widget_number: [
			{
				id:         -1,
				name:       "Single Number",
				icon:       "",
				component:  "Component_SingleNumber"
			}
		],

		list_widget_text: [
			{
				id:         -1,
				name:       "Text Field",
				icon:       "",
				component:  "Component_TextField"
			},
			{
				id:         -1,
				name:       "Item List",
				icon:       "",
				component:  "Component_ItemList"
			}
		],

		// interface
		Interface_addWidget: [],
		is_show_sidebar_right: false,

		// menu
		widget_sort_mode_list: [
			"Sort (Default)",
			"Sort (Lexical)"
		],
		widget_sort_index: 0,
		widget_sort_func_list: [],
		widget_sort_text: "",
	}),

	methods: {
		// handler
		Handler_addWidget(widget) {
			WidgetControl_addWidget(widget.component);
		},

		Handler_toggleSidebar() {
			this.is_show_sidebar_right = !this.is_show_sidebar_right;
		},

		Handler_sortList(index) {
			if (index < 0 || index >= this.widget_sort_func_list.length) return;
			this.widget_sort_index = index;
			this.Internal_sortWidgetList();
		},

		Handler_enableSetting() {
			ItemManager_setItem("Setting/enable", true);
		},

		// internal
		Internal_sortWidgetList() {
			this.widget_sort_func_list[this.widget_sort_index]();
			this.widget_sort_text = this.widget_sort_mode_list[this.widget_sort_index];
		},

		Internal_sortWidgetList_ID() {
			// sort sub item in the list
			for (let i = 0; i < this.list_widget.length; ++i) {
				const list = this.list_widget[i].list;
				list.sort(
					(a, b) => a.id < b.id ? -1 : 1
				);
			}

			// sort item in the list
			this.list_widget.sort(
				(a, b) => a.id < b.id ? -1 : 1
			);
		},

		Internal_sortWidgetList_Lex() {
			// sort sub item in the list
			for (let i = 0; i < this.list_widget.length; ++i) {
				const list = this.list_widget[i].list;
				list.sort(
					(a, b) => a.name < b.name ? -1 : 1
				);
			}

			// sort item in the list
			this.list_widget.sort(
				(a, b) => a.name < b.name ? -1 : 1
			);
		},
	},

	mounted() {
		// set list widget
		this.list_widget = [
			{
				id:   -1,
				name: "Chart",
				list: this.list_widget_graph,
				icon: "mdi-chart-bar",
			},
			{
				id:   -1,
				name: "Number",
				list: this.list_widget_number,
				icon: "mdi-numeric-1-box-outline",
			},
			{
				id:   -1,
				name: "Text",
				list: this.list_widget_text,
				icon: "mdi-alpha-a-box-outline",
			}
		];

		// assign id for each widget tab
		let index = 1;
		for (let i = 0; i < this.list_widget.length; ++i) {
			// outer
			this.list_widget[i].id = index;
			index++;

			// inner
			if (this.list_widget[i].list == null) continue;
			for (let j = 0; j < this.list_widget[i].list.length; ++j) {
				this.list_widget[i].list[j].id = j;
			}
		}

		// sorting
		this.widget_sort_index = 0;
		this.widget_sort_func_list.push(this.Internal_sortWidgetList_ID);
		this.widget_sort_func_list.push(this.Internal_sortWidgetList_Lex);
		this.Internal_sortWidgetList();
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

.v-list-item--dense, .v-list--dense .v-list-item {
	min-height: 25px;
}

.Main_opacity_1 {
	background: rgba(100, 115, 130, 0.7);
	backdrop-filter: blur(8px);
}
</style>
