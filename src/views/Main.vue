<template>
	<div class="d-flex justify-start fill-height">

		<!-- sidebar - right -->
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
						style="background-color: #1A237E;"
						dense
						mini-variant
						mini-variant-width="50"
						permanent
				>
					<v-list-item>
						<v-btn
								icon
								color="white"
						>
							<v-icon>mdi-plus</v-icon>
						</v-btn>
					</v-list-item>

					<v-list-item>
						<v-btn
								icon
								color="white"
						>
							<v-icon>mdi-plus</v-icon>
						</v-btn>
					</v-list-item>

					<v-spacer></v-spacer>

<!--					<v-list-item>-->
<!--						<v-btn-->
<!--								icon-->
<!--						>-->
<!--							<v-icon>mdi-plus</v-icon>-->
<!--						</v-btn>-->
<!--					</v-list-item>-->
				</v-navigation-drawer>
				<!-- drawer left -->

				<!-- drawer right -->
				<v-navigation-drawer
						style="background-color: #283593;"
						width="250"
						permanent
				>
					<v-list-item
							v-for="item in list_widget"
							link
							@click="Handler_addWidget(item)"
					>

						<v-list-item-avatar>
							<v-icon
									color="white"
							>
								{{ item.icon }}
							</v-icon>
						</v-list-item-avatar>

						<v-list-item-content>
							<v-list-item-title
									class="white--text font-weight-light"
							>
								{{ item.name }}
							</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-navigation-drawer>
				<!-- drawer right -->

			</v-row>
		</v-container>
		<!-- sidebar -->

		<Dashboard
				v-bind:Interface_addWidget="Interface_addWidget"
		/>

	</div>
</template>


<script>
import Dashboard from "@/views/Dashboard";


export default {
	name: "Main",

	components: {
		Dashboard
	},

	data: () => ({
		// sidebar
		list_widget: [
			{
				name: "Line Chart",
				icon: "mdi-plus",
				component: "Component_ChartLine"
			},
			{
				name: "Bar Chart",
				icon: "mdi-minus",
				component: "Component_ChartLine"
			},
			{
				name: "Pie Chart",
				icon: "mdi-plus",
				component: "Component_ChartLine"
			}
		],

		// interface
		Interface_addWidget: [],
		is_show_sidebar_right: false
	}),

	methods: {
		Handler_addWidget(widget) {
			this.Interface_addWidget.splice(0, 1, widget);
		},

		Handler_toggleSidebar() {
			this.is_show_sidebar_right = !this.is_show_sidebar_right;
		}
	},

	mounted() {
	}
}
</script>


<style scoped>

</style>
