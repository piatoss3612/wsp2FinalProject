<template>
  <v-app>
    <v-app-bar app color="yellow">
      <v-toolbar-title class="text-h5 font-weight-bold">Sketch It</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-divider vertical></v-divider>
      <v-btn icon id="save">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn icon id="clear">
        <v-icon>mdi-eraser</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      hover: false,
    }
  }
}
</script>
