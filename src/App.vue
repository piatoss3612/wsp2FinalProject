<template>
  <v-app id="customFont">
    <v-app-bar app color="yellow">
      <v-toolbar-title class="mx-auto font-weight-bold"
        >Sketch It</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="black"
            v-bind="attrs"
            v-on="on"
            icon
            x-large
            id="help"
            @click="openGuide()"
          >
            <v-icon>mdi-help-box</v-icon>
          </v-btn>
        </template>
        <span>Quick Guide</span>
      </v-tooltip>
      <v-divider vertical></v-divider>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="black" v-bind="attrs" v-on="on" icon x-large id="save">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </template>
        <span>Save Sketch</span>
      </v-tooltip>
      <v-divider vertical></v-divider>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="black" v-bind="attrs" v-on="on" icon x-large id="clear">
            <v-icon>mdi-eraser</v-icon>
          </v-btn>
        </template>
        <span>Clear Canvas</span>
      </v-tooltip>
    </v-app-bar>
    <v-main>
      <v-overlay :value="guide">
        <v-stepper v-model="pagination" vertical>
          <v-stepper-step :complete="pagination > 1" step="1">
            Select The Model!
            <small>more than 100 models</small>
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-card color="white" class="mb-12" height="80px" width="360px">
              <v-img src="./assets/guide/step1.png" position="center"></v-img>
            </v-card>
            <v-btn color="primary" @click="pagination = 2"> Continue </v-btn>
            <v-btn text @click="guide = !guide"> Cancel </v-btn>
          </v-stepper-content>
          <v-stepper-step :complete="pagination > 2" step="2">
            Wait The Model Loaded!
            <small>wait 1~2 seconds</small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-card color="white" class="mb-12" height="60px" width="360px">
              <v-img src="./assets/guide/step2.png" position="center"></v-img>
            </v-card>
            <v-btn color="primary" @click="pagination = 3"> Continue </v-btn>
            <v-btn text @click="guide = !guide"> Cancel </v-btn>
          </v-stepper-content>
          <v-stepper-step :complete="pagination > 3" step="3">
            Sketch It!
            <small>AI will help you out</small>
          </v-stepper-step>
          <v-stepper-content step="3">
            <v-card color="white" class="mb-12" height="240px" width="360px">
              <v-img src="./assets/guide/step3.png" position="center"></v-img>
            </v-card>
            <v-btn color="primary" @click="pagination = 4"> Continue </v-btn>
            <v-btn text @click="guide = !guide"> Cancel </v-btn>
          </v-stepper-content>
          <v-stepper-step :complete="pagination > 4" step="4">
            Save / Clear Your Sketch!
            <small>click the button</small>
          </v-stepper-step>
          <v-stepper-content step="4">
            <v-card
              color="grey lighten-1"
              class="mb-12"
              height="110px"
              width="360px"
            >
              <v-img src="./assets/guide/step4.png" position="center"></v-img>
            </v-card>
            <v-btn
              color="primary"
              @click="
                guide = !guide;
                pagination = 1;
              "
            >
              Complete
            </v-btn>
            <v-btn text @click="guide = !guide"> Cancel </v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-overlay>
      <router-view />
    </v-main>
  </v-app>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      guide: false,
      pagination: 1,
    };
  },
  methods: {
    openGuide: function () {
      this.guide = true;
    },
  },
};
</script>
<style>
@font-face {
  font-family: 'CookieRun-Regular';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/CookieRun-Regular.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

#customFont {
  font-family: 'CookieRun-Regular';
}
</style>