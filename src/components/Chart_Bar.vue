<script>
import { Bar } from "vue-chartjs"


export default {
	name: "Component_BarChart",
	extends: Bar,

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
				{
					data: []
				},
			],
			labels: []
		};

		this.chart_option = {
			maintainAspectRatio: false,
			responsive: true
		};

		// render
		this.renderChart(this.chart_data, this.chart_option);
	},

	watch: {
		Interface_data(new_value, old_value) {
			this.chart_data.datasets[0].data = new_value[0];
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
