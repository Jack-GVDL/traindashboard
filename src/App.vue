<template>
  <v-app>
		<Main/>
  </v-app>
</template>


<script lang="ts">
import Vue from 'vue';
import Main from "@/views/Main.vue";


export default Vue.extend({
  name: 'App',
	components: {
  	Main
	}
});
</script>


<style scoped>
</style>
