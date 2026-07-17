// Client-side inference with ONNX Runtime Web. The model is the same
// EfficientNetB0 the API served; images never leave the browser.
import type { InferenceSession } from "onnxruntime-web";

// Cleaned the same way main.py did: "Tomato___" prefix stripped,
// underscores replaced with spaces. Order matches class_names.json.
export const CLASS_NAMES = [
  "Bacterial spot",
  "Early blight",
  "Late blight",
  "Leaf Mold",
  "Septoria leaf spot",
  "Spider mites Two-spotted spider mite",
  "Target Spot",
  "Tomato Yellow Leaf Curl Virus",
  "Tomato mosaic virus",
  "healthy",
];

const MODEL_URL = "/model/model.onnx";
const SIZE = 224;

let sessionPromise: Promise<InferenceSession> | null = null;

async function getSession() {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      const ort = await import("onnxruntime-web");
      ort.env.wasm.wasmPaths = "/ort/";
      return ort.InferenceSession.create(MODEL_URL, {
        executionProviders: ["wasm"],
      });
    })();
    sessionPromise.catch(() => {
      sessionPromise = null;
    });
  }
  return sessionPromise;
}

/** Warm the model download/compile in the background. Safe to call often. */
export function preloadModel() {
  getSession().catch(() => {});
}

async function fileToTensorData(file: File): Promise<Float32Array> {
  const bitmap = await createImageBitmap(file, {
    resizeWidth: SIZE,
    resizeHeight: SIZE,
    resizeQuality: "high",
  });
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  ctx.drawImage(bitmap, 0, 0, SIZE, SIZE);
  bitmap.close();
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

  // NHWC float32, raw 0-255 values: EfficientNetB0 rescales internally
  const out = new Float32Array(SIZE * SIZE * 3);
  for (let i = 0, j = 0; i < data.length; i += 4) {
    out[j++] = data[i];
    out[j++] = data[i + 1];
    out[j++] = data[i + 2];
  }
  return out;
}

export interface LocalPrediction {
  className: string;
  confidence: number;
}

export async function predict(file: File): Promise<LocalPrediction> {
  const ort = await import("onnxruntime-web");
  const [session, tensorData] = await Promise.all([
    getSession(),
    fileToTensorData(file),
  ]);

  const input = new ort.Tensor("float32", tensorData, [1, SIZE, SIZE, 3]);
  const results = await session.run({ [session.inputNames[0]]: input });
  const output = results[session.outputNames[0]].data as Float32Array;

  let best = 0;
  for (let i = 1; i < output.length; i++) {
    if (output[i] > output[best]) best = i;
  }
  return {
    className: CLASS_NAMES[best] ?? "Unknown",
    confidence: output[best],
  };
}
