<template>
  <v-app>
    <v-app-bar app color="yellow" >
      <v-toolbar-title class="text-h5 font-weight-bold">Sketch It</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="black"
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
        <span>Open Guide</span>
      </v-tooltip>
      <v-divider vertical></v-divider>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              color="black"
              v-bind="attrs"
              v-on="on"
              icon
              x-large
              id="save">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </template>
        <span>Save Sketch</span>
      </v-tooltip>
      <v-divider vertical></v-divider>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="black"
                 v-bind="attrs"
                 v-on="on"
                 icon
                 x-large
                 id="clear">
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
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-card
                color="grey lighten-1"
                class="mb-12"
                height="240px"
                width="360px"
            ></v-card>
            <v-btn
                color="primary"
                @click="pagination = 2"
            >
              Continue
            </v-btn>
            <v-btn text @click="guide = !guide">
              Cancel
            </v-btn>
          </v-stepper-content>
          <v-stepper-step :complete="pagination > 2" step="2">
            Wait The Model Loaded!
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-card
                color="grey lighten-1"
                class="mb-12"
                height="240px"
                width="360px"
            ></v-card>
            <v-btn
                color="primary"
                @click="pagination = 3"
            >
              Continue
            </v-btn>
            <v-btn text @click="guide = !guide">
              Cancel
            </v-btn>
          </v-stepper-content>
          <v-stepper-step :complete="pagination > 3" step="3">
            Sketch It!
          </v-stepper-step>
          <v-stepper-content step="3">
            <v-card
                color="grey lighten-1"
                class="mb-12"
                height="240px"
                width="360px"
            ></v-card>
            <v-btn
                color="primary"
                @click="pagination = 4"
            >
              Continue
            </v-btn>
            <v-btn text @click="guide = !guide">
              Cancel
            </v-btn>
          </v-stepper-content>
          <v-stepper-step :complete="pagination > 4" step="4">
            Save / Clear Your Sketch!
          </v-stepper-step>
          <v-stepper-content step="4">
            <v-card
                color="grey lighten-1"
                class="mb-12"
                height="240px"
                width="360px"
            ></v-card>
            <v-btn
                color="primary"
                @click="guide = !guide; pagination = 1;"
            >
              Complete
            </v-btn>
            <v-btn text @click="guide = !guide">
              Cancel
            </v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-overlay>
      <router-view/>
    </v-main>
  </v-app>
</template>
<script>

export default {
  name: 'App',
  data() {
    return {
      guide: false,
      pagination: 1,
    }
  },
  methods: {
    openGuide: function() {
      this.guide= true;
    }
  }
}
</script>
