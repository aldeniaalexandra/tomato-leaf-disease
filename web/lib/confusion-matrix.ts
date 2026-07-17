// Row-normalised percentages transcribed from the evaluation notebook
// (img/confusion_matrix.png). Rows are true labels, columns are predictions.
export const matrixLabels = [
  "Bacterial spot",
  "Early blight",
  "Late blight",
  "Leaf Mold",
  "Septoria leaf spot",
  "Spider mites",
  "Target Spot",
  "Yellow Leaf Curl Virus",
  "Mosaic Virus",
  "Healthy",
];

export const matrixShortLabels = [
  "Bacterial",
  "Early bl.",
  "Late bl.",
  "Leaf Mold",
  "Septoria",
  "Mites",
  "Target",
  "YLCV",
  "Mosaic",
  "Healthy",
];

// Narrow screens leave about 24px per column, so the diagonal column labels
// have to stay under that width to avoid colliding with their neighbour.
export const matrixTinyLabels = [
  "Bact.",
  "Early",
  "Late",
  "Mold",
  "Sept.",
  "Mites",
  "Target",
  "YLCV",
  "Mosaic",
  "Healthy",
];

export const confusionMatrix: number[][] = [
  [100, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 99, 0, 0, 1, 0, 0, 0, 0, 0],
  [1, 1, 97, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 100, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 100, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 97, 1, 0, 0, 2],
  [0, 0, 0, 0, 1, 0, 98, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 99, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 100, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 100],
];
