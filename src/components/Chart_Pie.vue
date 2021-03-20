<script>
import { Doughnut } from "vue-chartjs"


export default {
	name: "Component_PieChart",
	extends: Doughnut,

	props: [
		"Interface_data",
		"Interface_label"
	],

	data: () => ({
		chart_data: {},
		chart_option: {}
	}),

	methods: {
	},

	mounted() {
		// chart data
		this.chart_data = {
			datasets: [
			],
			labels: []
		};

		this.chart_option = {
			legend: {
				labels: {
					fontColor: "#C6C8CA",
				},
				display: true
			},
			animation: {
				duration: 1
			},
			tooltips: {
				enabled: true
			},
			maintainAspectRatio: false,
			responsive: true
		};

		// render
		this.renderChart(this.chart_data, this.chart_option);
	},

	watch: {
		Interface_data(new_value, old_value) {
			this.chart_data.datasets = new_value[0];
			this.renderChart(this.chart_data, this.chart_option);
		},

		Interface_label(new_value, old_value) {
			this.chart_data.labels = new_value[0];
			this.renderChart(this.chart_data, this.chart_option);
		}
	}
}
</script>

<style scoped>
</style>
