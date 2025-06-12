
<template lang="pug">
  v-app
    v-main
      AuthPhoneNumber
</template>


<script lang="ts">
import AuthPhoneNumber from './components/auth/AuthPhoneNumber.vue';
export default {
  name: 'App',
  components: {
    AuthPhoneNumber
  }
};
</script>

<style scoped>
.logo {
  height: 6em;  
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
