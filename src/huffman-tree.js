const kWidth = 600;
const kHeight = 600;

// Centered in the unit square starting at (0, 0)
class Node {
  #drawContents = null;

  constructor(drawContents) {
    this.#drawContents = drawContents;
  }

  draw(w, h) {
    console.log("node.draw(", w, h, ")");
    // let inscribedSquare = 0.5 * sqrt(2);
    // let offset = (1 - inscribedSquare) / 2;
    circle(w / 2, h / 2, Math.min(w, h));
    // push();
    // translate(offset, offset);
    // scale(inscribedSquare);
    // this.#drawContents();
    // pop();
  }
}

// Drawn in the unit square starting at (0, 0)
class BinaryTree {
  #value = null;
  #left = null;
  #right = null;

  constructor(node) {
    this.#value = node;
  }

  static fromJSON(json) {
    if (json == null) {
      return null;
    }
    let node = new Node((w, h) => {
      textAlign(CENTER, CENTER);
      text(json.name, w / 2, h / 2);
    });
    let tree = new BinaryTree(node);
    tree.#left = BinaryTree.fromJSON(json.left);
    tree.#right = BinaryTree.fromJSON(json.right);
    return tree;
  }

  depth() {
    return Math.max(this.#left?.depth() ?? 0, this.#right?.depth() ?? 0) + 1;
  }

  width() {
    return 1 + (this.#left?.width() ?? 0) + (this.#right?.width() ?? 0);
  }

  maxWidth() {
    return 2 ** (this.depth() - 1);
  }

  drawImpl(w, h, d, topCenter, nodeSize, linkSize) {
    console.log("tree.drawImpl(", w, h, topCenter, nodeSize, linkSize, ")");
    // Draw the root
    {
      push();
      translate(topCenter[0] - nodeSize / 2, topCenter[1]);
      this.#value.draw(nodeSize, nodeSize);
      pop();
    }

    console.log(d);
    let s = 2 ** (d - 1);

    let bottomCenter = [topCenter[0], topCenter[1] + nodeSize];

    let topLeft = [topCenter[0] - s * nodeSize, bottomCenter[1] + linkSize];
    let topRight = [topCenter[0] + s * nodeSize, bottomCenter[1] + linkSize];
    if (this.#left != null) {
      line(bottomCenter[0], bottomCenter[1], topLeft[0], topLeft[1]);
      this.#left.drawImpl(w, h, d - 1, topLeft, nodeSize, linkSize);
    }
    if (this.#right != null) {
      line(bottomCenter[0], bottomCenter[1], topRight[0], topRight[1]);
      this.#right.drawImpl(w, h, d - 1, topRight, nodeSize, linkSize);
    }
  }

  draw(w, h) {
    let depth = this.depth();
    let nodeSizeH = h / (2 * depth - 1);
    let nodeSizeW = w / (this.maxWidth() * 2);
    let nodeSize = Math.min(nodeSizeH, nodeSizeW);
    let linkSize = (h - nodeSize * depth) / (depth - 1);
    console.log("nodeSize", nodeSize, nodeSizeH, nodeSizeW);
    console.log("tree.draw");
    this.drawImpl(w, h, depth - 1, [w / 2, 0], nodeSize, linkSize);
  }
}

function setupInput() {
  push();
  const input = createInput("Hello");
  input.position(10, 10);
  input.size(200, 20);

  // input.parent("viewport");
  pop();
}

function drawFrame() {
  const frameWeight = 2;
  push();
  // Set frame background to white
  fill(255);
  // Set the frame to black
  stroke(0);
  // Set the frame width
  strokeWeight(frameWeight);
  // Draw the frame
  rect(
    frameWeight / 2,
    frameWeight / 2,
    kWidth - frameWeight,
    kHeight - frameWeight
  );
  // scale(kWidth - frameWeight, kHeight - frameWeight);
  let tree = BinaryTree.fromJSON({
    name: "A",
    left: {
      name: "B",
      left: {
        name: "D",
        left: null,
        right: null,
      },
      right: {
        name: "E",
        left: null,
        right: null,
      },
    },
    right: {
      name: "C",
      left: {
        name: "F",
        left: null,
        right: null,
      },
      right: {
        name: "G",
        left: null,
        right: { name: "H", left: null, right: null},
        // right: null,
      },
    },
  });
  tree.draw(kWidth - frameWeight, kHeight - frameWeight);
  pop();
}

function setup() {
  createCanvas(kWidth, kHeight);
  setupInput();
  drawFrame();
  noLoop();
}

// const width = 400;
// const height = 600;
// const frameWeight = 50;

// const frameWidth = width + frameWeight * 2;
// const frameHeight = height + frameWeight * 2;

// function setup() {
//     createCanvas(frameWidth, frameHeight);
//     noLoop();
// }

// function drawFrame() {
//     push();
//     // Set frame background to white
//     fill(255);
//     // Set the frame to black
//     stroke(0);
//     // Set the frame width
//     strokeWeight(frameWeight);
//     // Draw the frame
//     rect(frameWeight / 2, frameWeight / 2, width + frameWeight, height + frameWeight);
//     pop();
// }

// function drawStem() {
//     push();
//     noFill();

//     const stemFill = color(90, 160, 0);
//     const stemStroke = color(60, 90, 0);

//     stroke(stemStroke);
//     strokeWeight(6);
//     arc(width * 0.75, height * 0.65, width * 0.5, width * 0.75, HALF_PI * 1.3, PI);

//     stroke(stemFill);
//     strokeWeight(3);
//     arc(width * 0.75, height * 0.65, width * 0.5, width * 0.75, HALF_PI * 1.3, PI);
//     pop();
// }

// function drawLeaf() {
//     push();

//     const leafColor = color(90, 160, 0);

//     strokeWeight(1);
//     stroke(60, 90, 0);

//     fill(leafColor);

//     beginShape();
//     vertex(0, 0);
//     bezierVertex(60, 25, 0, 80, 0, 100);
//     bezierVertex(0, 80, -60, 25, 0, 0);
//     endShape();

//     strokeWeight(2);
//     stroke(0, 0, 0, 50);
//     line(0, 1, 0, 99);

//     const veins = () => {
//         line(1, 10, 20, 25);
//         line(1, 30, 20, 45);
//         line(1, 50, 13, 61);
//         line(1, 70, 6, 76);
//     };

//     push();
//     veins();
//     scale(-1, 1);
//     veins();
//     pop();

//     pop();
// }

// function drawPetal() {
//     push();

//     const petalFill = color(160, 10, 70);
//     const petalStroke = color(120, 5, 45);
//     // const petalStroke = color(90, 5, 45);

//     fill(petalFill);
//     stroke(petalStroke);
//     strokeWeight(2);

//     beginShape();
//     curveVertex(0, 2);
//     curveVertex(20, 0);
//     curveVertex(36, 20);
//     curveVertex(45, 40);
//     curveVertex(50, 60);
//     curveVertex(45, 70);
//     curveVertex(30, 80);
//     curveVertex(15, 85);
//     curveVertex(0, 87);
//     curveVertex(-15, 85);
//     curveVertex(-30, 80);
//     curveVertex(-45, 70);
//     curveVertex(-50, 60);
//     curveVertex(-45, 40);
//     curveVertex(-36, 20);
//     curveVertex(-20, 0);
//     curveVertex(0, 2);
//     curveVertex(20, 0);
//     curveVertex(35, 20);

//     endShape();

//     // stroke(186, 81, 20);
//     stroke(200, 130, 20);
//     strokeWeight(2);

//     push();
//     for (let i = 0; i < 2; ++i) {
//         bezier(1, 2, 1, 50, 7, 60, 15, 80);
//         bezier(2, 2, 5, 30, 10, 50, 30, 73);
//         bezier(3, 2, 10, 25, 15, 40, 40, 59);
//         bezier(4, 2, 13, 20, 20, 30, 40, 40);
//         scale(-1, 1);
//     }
//     pop();

//     pop();
// }

// function drawPetals()
// {
//     const dist = width * 0.08;
//     push();
//     translate(0, dist);
//     for (let i = 0; i < 4; ++i) {
//         translate(-dist, -dist);
//         rotate(HALF_PI);
//         drawPetal();
//     }
//     pop();
// }

// function draw() {
//     drawFrame();
//     // Set the new coordinates to start in the frame
//     translate(frameWeight, frameWeight);

//     push();
//     // scale(1.5);
//     drawStem();
//     pop();

//     push();
//     translate(width * 0.51, height * 0.78);
//     rotate(HALF_PI * 1.10);
//     scale(1.5);
//     drawLeaf();
//     pop();

//     push();
//     translate(width * 0.55, height * 0.76);
//     rotate(-HALF_PI * 1.30);
//     scale(1.3, 1.6);
//     drawLeaf();
//     pop();

//     push();
//     translate(width * 0.5, height * 0.43 - width * 0.08);
//     scale(1.4);
//     rotate(QUARTER_PI);
//     drawPetals();
//     pop();
// }
