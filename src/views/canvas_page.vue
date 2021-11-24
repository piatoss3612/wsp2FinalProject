<template>
  <v-container fluid>
    <v-row>
      <v-col xs="12" sm="8" id="canvasContainer">
        <div id="canvas"></div>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col xs="12" sm="4" class="d-flex flex-column">
        <v-row class="ma-2 pa-2 flex-grow-0">
          <v-col>
            <v-select
              :items="modelList"
              v-model="currentModel"
              label="Select Model"
              @change="modelChange"
              height="50px"
            ></v-select>
          </v-col>
        </v-row>
        <v-spacer></v-spacer>
        <v-row align="end" class="ma-2 pa-2 flex-grow-0">
          <v-col>
            <v-chip-group column>
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
      </v-col>
    </v-row>
    <v-snackbar color="primary" v-model="isLoaded" timeout="2000" dark shaped
      >sketchRNN Model Loaded!
    </v-snackbar>
  </v-container>
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
    };
  },
  mounted() {
    const script = (p) => {
      p.setup = () => {
        const containerSize = document
          .getElementById("canvas")
          .getBoundingClientRect();
        const canvasWidth = Math.floor(containerSize.width);
        const canvasHeight = (p.windowHeight / 1.2);
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
          // p.stroke(25, 25, 112); // midnight blue
          p.stroke(0, 0, 255); // blue
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
        const containerResized = document
          .getElementById("canvas")
          .getBoundingClientRect();
        const resizedWidth = Math.floor(containerResized.width);
        const resizedHeight = (p.windowHeight / 1.2);
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
    },
  },
};
</script>
