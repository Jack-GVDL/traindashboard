<template>
	<div class="fill-height">
		<Chart_Line
				style="height: 100%;"
				v-bind:Interface_data="chart_data"
				v-bind:Interface_label="chart_label"
		/>
	</div>
</template>


<script>
import Chart_Line from "@/components/Chart_Line";


export default {
	name: "Component_ChartLine",
	components: {
		Chart_Line
	},

	data: () => ({
		chart_data: [[]],
		chart_label: [[]]
	}),

	methods: {

	},

	mounted() {
		// TODO: test
		const temp_data = [];
		const temp_label = [];

		for (let i = 0; i < 10; ++i) {
			temp_data.push(i * i);
			temp_label.push(i.toString());
		}

		this.chart_data.splice(0, 1, temp_data);
		this.chart_label.splice(0, 1, temp_label);
	},

	watch: {

	}
}
</script>


<style scoped>
.height_responsive {
	height: 100% !important;
}
</style>
