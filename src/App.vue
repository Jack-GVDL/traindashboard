<template>
  <v-app>
		<Main/>
  </v-app>
</template>


<script lang="ts">
import Vue from 'vue';
import Main from "@/views/Main.vue";

import {
	Server_init,
	Server_update
} from "@/utility/Server_Data";

import {
	ItemManager_addCallback_UpdatePre
} from "@/utility/ItemManager";
import {
	WidgetControl_init
} from "@/utility/WidgetControl";
import {
	Observer_LogData_init
} from "@/utility/Observer_LogData";


export default Vue.extend({
  name: 'App',

	components: {
  	Main
	},

	mounted: function () {
		Server_init();
		Server_update();
		Observer_LogData_init();
		WidgetControl_init();

		// ItemManager_addCallback_UpdatePre((data: any) => console.log(data.name));
	}
});
</script>


<style scoped>
/* ----- Scrollbar ----- */
/* width */
::-webkit-scrollbar {
	width: 12px;
}

/* track */
::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0);
}

/* handle */
::-webkit-scrollbar-thumb {
	background: rgba(150, 160, 170, 0.7);
}

/* handle on hover */
::-webkit-scrollbar-thumb:hover {
	background: #555;
}
</style>
