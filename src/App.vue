<template>
  <v-app id="app">
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer class="justify-center" app dark padless rounded max-width="280">
      <v-btn class="ma-2" value="canvas" @click="$router.push('/')">
        <span>canvas</span>
        <v-icon>mdi-draw</v-icon>
      </v-btn>
      <v-btn class="ma-2" value="gallery" @click="$router.push('/gallery')">
        <span>gallery</span>
        <v-icon>mdi-image-filter-frames</v-icon>
      </v-btn>
    </v-footer>
  </v-app>
</template>
<script>
export default {
  name: "App",
};
</script>
<style>
@import "./assets/index.css";
</style>
