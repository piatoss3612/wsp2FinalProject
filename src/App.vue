<template>
  <v-app id="app">
    <v-main app>
      <v-overlay :value="guide" opacity="0.8">
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
      <v-container fluid>
        <v-row>
          <v-col xs="8" sm="4">
            <v-select
              :items="modelList"
              v-model="currentModel"
              label="Select Model"
              @change="modelChange"
              height="30px"
            ></v-select>
          </v-col>
          <v-col xs="4" sm="4">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="hidden-xs-only"
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
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="black"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  x-large
                  id="save"
                >
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
              </template>
              <span>Save Sketch</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="black"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  x-large
                  id="clear"
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </template>
              <span>Clear Canvas</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-chip-group column class="hidden-xs-only">
              <v-chip
                v-for="chip in chips"
                :key="chip"
                close
                @click:close="chips.splice(chips.indexOf(chip), 1)"
                >{{ chip }}</v-chip
              >
            </v-chip-group>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid>
        <v-row>
          <v-col id="canvasContainer">
            <div id="canvas"></div>
          </v-col>
        </v-row>
        <v-snackbar
          color="primary"
          v-model="isLoaded"
          timeout="2000"
          dark
          shaped
          >sketchRNN Model Loaded!
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import ml5 from "ml5";
import P5 from "p5";
import modelList from "@/assets/models";

let count = Math.floor(Math.random() * 100);

export default {
  name: "App",
  data() {
    return {
      model: null,
      previousPen: "down",
      x: null,
      y: null,
      strokePath: null,
      seedStrokes: [],
      canvas: null,
      modelList: modelList,
      currentModel: "cat",
      isLoaded: false,
      chips: [],
      guide: false,
      pagination: 1,
    };
  },
  mounted() {
    const script = (p) => {
      p.setup = () => {
        const canvasSize = document
          .getElementById("canvasContainer")
          .getBoundingClientRect();
        const canvasWidth = Math.floor(canvasSize.width);
        const canvasHeight = Math.floor(canvasSize.height);
        this.canvas = p.createCanvas(canvasWidth, canvasHeight);
        this.canvas.mousePressed(p.resetDrawing);
        this.canvas.mouseReleased(p.startSketchRNN);
        p.background(230);
        this.modelChange();

        const saveBtn = p.select("#save");
        saveBtn.mousePressed(p.saveDrawing);
        const clearBtn = p.select("#clear");
        clearBtn.mousePressed(p.clearDrawing);
      };

      p.draw = () => {
        if (p.mouseIsPressed) {
          p.stroke(0, 0, 255);
          p.strokeWeight(4);
          p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);

          const userStroke = {
            dx: p.mouseX - p.pmouseX,
            dy: p.mouseY - p.pmouseY,
            pen: "down",
          };
          this.seedStrokes.push(userStroke);
        }

        if (this.strokePath) {
          if (this.previousPen === "down") {
            p.stroke(0);
            p.strokeWeight(4);
            p.line(
              this.x,
              this.y,
              this.x + this.strokePath.dx,
              this.y + this.strokePath.dy
            );
          }
          this.x += this.strokePath.dx;
          this.y += this.strokePath.dy;
          this.previousPen = this.strokePath.pen;

          if (this.strokePath.pen !== "end") {
            this.strokePath = null;
            this.model.generate(p.gotStroke);
          }
        }
      };

      p.resetDrawing = () => {
        this.seedStrokes = [];
        this.model.reset();
      };

      p.startSketchRNN = () => {
        this.x = p.mouseX;
        this.y = p.mouseY;
        this.model.generate(this.seedStrokes, p.gotStroke);
      };

      p.gotStroke = (err, result) => {
        this.strokePath = result;
      };

      p.saveDrawing = () => {
        p.saveCanvas(this.canvas, "sketch" + count, "png");
        count++;
      };

      p.clearDrawing = () => {
        p.clear();
        p.background(234);
        this.chips = [this.currentModel];
      };

      p.windowResized = () => {
        const resizedSize = document
          .getElementById("canvasContainer")
          .getBoundingClientRect();
        const resizedWidth = Math.floor(resizedSize.width);
        const resizedHeight = Math.floor(resizedSize.height);
        p.resizeCanvas(resizedWidth, resizedHeight);
        p.background(230);
      };
    };
    new P5(script, "canvas");
  },
  methods: {
    modelReady: function () {
      this.isLoaded = true;
    },
    modelChange: function () {
      this.model = ml5.sketchRNN(this.currentModel, this.modelReady);
      this.chips.push(this.currentModel);
      if (this.chips.length > 8) {
        this.chips.shift();
      }
    },
    openGuide: function () {
      this.guide = true;
    },
  },
};
</script>
<style>
@import "./assets/index.css";
</style>
