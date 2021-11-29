<template>
  <v-app id="app">
    <v-main>
      <v-overlay :value="guideIsOpen" opacity="0.8">
        <v-stepper v-model="pagination" vertical>
          <v-stepper-step :complete="pagination > 1" step="1">
            Select The Model!
            <small>more than 100 models</small>
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-card color="white" class="mb-12" height="40px" width="360px">
              <v-img src="./assets/guide/step1.png" position="center"></v-img>
            </v-card>
            <v-btn color="primary" @click="pagination = 2"> Continue </v-btn>
            <v-btn text @click="guideIsOpen = !guideIsOpen"> Cancel </v-btn>
          </v-stepper-content>
          <v-stepper-step :complete="pagination > 2" step="2">
            Wait The Model Loaded!
            <small>wait 1~2 seconds</small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-card color="white" class="mb-12" height="40px" width="360px">
              <v-img src="./assets/guide/step2.png" position="center"></v-img>
            </v-card>
            <v-btn color="primary" @click="pagination = 3"> Continue </v-btn>
            <v-btn text @click="guideIsOpen = !guideIsOpen"> Cancel </v-btn>
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
            <v-btn text @click="guideIsOpen = !guideIsOpen"> Cancel </v-btn>
          </v-stepper-content>
          <v-stepper-step :complete="pagination > 4" step="4">
            Save / Clear Your Sketch!
            <small>click the button</small>
          </v-stepper-step>
          <v-stepper-content step="4">
            <v-card color="white" class="mb-12" height="80px" width="360px">
              <v-img src="./assets/guide/step4.png" position="center"></v-img>
            </v-card>
            <v-btn
              color="primary"
              @click="
                guideIsOpen = !guideIsOpen;
                pagination = 1;
              "
            >
              Complete
            </v-btn>
            <v-btn text @click="guideIsOpen = !guideIsOpen"> Cancel </v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-overlay>
      <v-container fluid id="header">
        <v-row align="center">
          <v-col sm="4">
            <v-select
              rounded
              outlined
              hide-details
              color="#4e4e4e"
              background-color="#fafafa"
              :items="modelList"
              v-model="currentModel"
              label="Select Model"
              @click="modelSelectIsOpen = true"
              @blur="modelSelectIsOpen = false"
              @change="loadModel"
            ></v-select>
          </v-col>
          <v-col sm="4">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="#4e4e4e"
                  class="hidden-xs-only"
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
                  color="#4e4e4e"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  x-large
                  @click="openDialog"
                >
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
              </template>
              <span>Save Sketch</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="#4e4e4e"
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
        <v-row class="hidden-xs-only">
          <v-col>
            <v-chip-group dark show-arrows>
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
      <v-divider></v-divider>
      <v-container fluid>
        <v-row>
          <v-col>
            <div id="canvas"></div>
          </v-col>
        </v-row>
        <v-snackbar
          color="primary"
          v-model="modelIsLoaded"
          timeout="2000"
          dark
          shaped
          >sketchRNN Model Loaded!
        </v-snackbar>
      </v-container>
      <v-dialog v-model="saveDialogIsOpen" eager>
        <v-card outlined>
          <v-card-title>Save Sketch</v-card-title>
          <v-form ref="form" class="ma-2 pa-2">
            <v-text-field
              v-model="saveTitle"
              :counter="10"
              label="Title"
              :rules="titleRules"
              outlined
            ></v-text-field>
            <v-select
              v-model="saveType"
              :items="fileTypes"
              label="File Type"
              :rules="[(v) => !!v || 'You must choose type']"
              outlined
            ></v-select>
            <v-btn class="ma-2" color="success" id="save">Save</v-btn>
            <v-btn
              class="ma-2"
              dark
              @click="saveDialogIsOpen = !saveDialogIsOpen"
              >Close
            </v-btn>
          </v-form>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>
<script>
// import ml5 and p5 libraries
import ml5 from "ml5";
import P5 from "p5";
// import supported models list
import modelList from "@/assets/models";

export default {
  name: "App",
  data() {
    return {
      model: null, // initialize ml5.sketchRNN instance here
      modelList: modelList, // array of models that ml5 supports
      currentModel: "cat", // parameter of instance initialization
      modelIsLoaded: false, // change snackbar visibility
      modelSelectIsOpen: false, // whether v-select list is opened or not
      guideIsOpen: false, // change v-overlay visibility
      saveDialogIsOpen: false, // change v-dialog visibility
      chips: [], // array of currentModel
      pagination: 1, // v-stepper's step
      saveTitle: "sketch",
      titleRules: [
        // check validation of saveTitle
        (v) => !!v || "Title is required",
        (v) => (v && v.length <= 10) || "Title must be less than 10 characters",
      ],
      saveType: null,
      fileTypes: ["png", "jpg"],
    };
  },
  mounted() {
    let x, y; // current location of drawing
    let previousPen = "down";
    // current "stroke" of the drawing
    let strokePath;
    let seedStrokes = [];
    // storing a reference to the canvas
    let canvas;
    // script is seed to generate p5 instance
    // argument p is p5 object and it is used to refer p5 API
    const script = (p) => {
      // setup() and draw() function are kind of constructor of p5 instance
      // they should be defined attached to p (object)
      p.setup = () => {
        // get the size of element(id="canvas") and its position relative to the viewport
        const canvasSize = document
          .getElementById("canvas")
          .getBoundingClientRect();
        // get width from canvasSize
        const canvasWidth = Math.floor(canvasSize.width);
        // get height from canvasSize
        const canvasHeight = Math.floor(canvasSize.height);
        // create canvas, this can be called only at initialization of setup()
        canvas = p.createCanvas(canvasWidth, canvasHeight);
        // set event listener: if mouse is pressed on canvas, call resetDrawing
        canvas.mousePressed(resetDrawing);
        // set event listener: if mouse is released, call startSketchRNN
        canvas.mouseReleased(startSketchRNN);
        p.background(255); // set background color to white
        this.loadModel(); // initialize sketchRNN model

        // find element with id="save"
        const saveBtn = p.select("#save");
        // add event listener: if mouse is pressed on saveBtn, call saveDrawing
        saveBtn.mousePressed(saveDrawing);
        // find element with id="clear"
        const clearBtn = p.select("#clear");
        // add event listener: if mouse is pressed on clearBtn, call clearDrawing
        clearBtn.mousePressed(clearDrawing);
      };

      p.draw = () => {
        // this part is for user to draw
        // in the case of v-overlay & v-dialog & v-select is not opened
        // and mouse is pressed on canvas
        if (
          !this.guideIsOpen &&
          !this.saveDialogIsOpen &&
          !this.modelSelectIsOpen &&
          p.mouseIsPressed
        ) {
          // color of line is blue
          p.stroke(0, 0, 255);
          // line weight is 4
          p.strokeWeight(4);
          // draw along the line drawn by the user
          p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);

          // create a "stroke path" with dx, dy, and pen
          const userStroke = {
            dx: p.mouseX - p.pmouseX,
            dy: p.mouseY - p.pmouseY,
            pen: "down",
          };
          // Add to the array
          seedStrokes.push(userStroke);
        }

        // this part is for AI to draw
        // if something new to draw
        if (strokePath) {
          // if the pen is down, draw a line
          if (previousPen === "down") {
            p.stroke(0);
            p.strokeWeight(4);
            p.line(x, y, x + strokePath.dx, y + strokePath.dy);
          }
          // move the pen
          x += strokePath.dx;
          y += strokePath.dy;
          previousPen = strokePath.pen;

          // if the drawing is complete
          if (strokePath.pen !== "end") {
            strokePath = null;
            this.model.generate(gotStroke);
          }
        }
      };

      // this makes canvas responsive on breakpoint
      p.windowResized = () => {
        // if v-dialog and v-guide is not opened, handle the resize event
        if (!this.saveDialogIsOpen && !this.guideIsOpen) {
          const resizedSize = document
            .getElementById("canvas")
            .getBoundingClientRect();
          const resizedWidth = Math.floor(resizedSize.width);
          const resizedHeight = Math.floor(resizedSize.height);
          // resize the canvas
          p.resizeCanvas(resizedWidth, resizedHeight);
          p.background(255);
        }
      };

      // reset the drawing
      const resetDrawing = () => {
        seedStrokes = []; // clear seed strokes
        this.model.reset(); // reset model
      };

      // sketchRNN takes over
      const startSketchRNN = () => {
        // start where the mouse left off
        x = p.mouseX;
        y = p.mouseY;
        // generate with the seedStrokes
        this.model.generate(seedStrokes, gotStroke);
      };

      // get a new stroke path
      const gotStroke = (err, result) => {
        strokePath = result;
      };

      const saveDrawing = () => {
        // if validation of form is right, save the sketch
        if (this.$refs.form.validate()) {
          p.saveCanvas(canvas, this.saveTitle, this.saveType);
          this.saveTitle = "sketch";
          this.saveType = null;
          // close v-dialog
          this.saveDialogIsOpen = false;
        }
      };

      const clearDrawing = () => {
        p.clear();
        p.background(255);
        this.chips = [this.currentModel];
      };
    };
    // create p5 instance then render it on element that has id "canvas"
    new P5(script, "canvas");
  },
  methods: {
    modelReady: function () {
      // if model is ready, display v-snackbar
      this.modelIsLoaded = true;
    },
    loadModel: function () {
      // initialize sketchRNN instance
      // then if model is ready, trigger modelReady function
      this.model = ml5.sketchRNN(this.currentModel, this.modelReady);
      // if currentModel is not in array of chips, push it in the array
      if (!this.chips.includes(this.currentModel)) {
        this.chips.push(this.currentModel);
      }
    },
    openGuide: function () {
      // change visibility of v-overlay
      this.guideIsOpen = true;
    },
    openDialog: function () {
      // change visibility of v-dialog
      this.saveDialogIsOpen = true;
    },
  },
};
</script>
<style>
@import "./assets/index.css";
</style>
