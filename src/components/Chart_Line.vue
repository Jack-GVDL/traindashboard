<script>
import { Line } from "vue-chartjs"


export default {
	name: "Component_LineChart",
	extends: Line,

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
			scales: {
				yAxes: [{
					display: true,
					ticks: {
						fontColor: "#C6C8CA",
						fontSize: 10,
						min: 0,
						padding: 5
					},
					gridLines: {
						zeroLineColor: "white"
					},
					scaleLabel: {
						display: true
					}
				}],
				xAxes: [{
					display: true,
					ticks: {
						fontColor: "#C6C8CA",
						fontSize: 10,
						padding: 5
					},
					gridLines: {
						color: "transparent",
						zeroLineColor: "white"
					},
					scaleLabel: {
						display: true
					}
				}]
			},
			elements: {
				point:{
					radius: 0
				}
			},
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
