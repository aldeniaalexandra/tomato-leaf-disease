from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, HTTPException
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json

app = FastAPI(title="Tomato Leaf Disease")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = tf.keras.models.load_model("best_model.keras")

# Load class names
with open("class_names.json", "r") as f:
    class_names = json.load(f)

# Define input size
TARGET_SIZE = (224, 224)


def preprocess_image(image_bytes):
    """
    Preprocess input image:
    - Convert to RGB
    - Resize to target size
    - Normalize pixel values
    - Add batch dimension
    """
    image = Image.open(io.BytesIO(image_bytes))

    if image.mode != "RGB":
        image = image.convert("RGB")

    image = image.resize(TARGET_SIZE)

    img_array = np.array(image, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)

    return img_array


# Health check endpoint
@app.get("/")
def health_check():
    return {"status": "ok"}


# Prediction endpoint
@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Validate file type
    if not file.filename.lower().endswith((".jpg", ".jpeg", ".png")):
        raise HTTPException(
            status_code=400,
            detail="Only .jpg, .jpeg, or .png files are allowed"
        )

    try:
        # Read uploaded file
        contents = await file.read()

        # Preprocess image
        processed_image = preprocess_image(contents)

        # Model prediction
        prediction = model.predict(processed_image)

        # Get predicted class index and confidence
        predicted_index = int(np.argmax(prediction))
        confidence = float(np.max(prediction))

        # Map index to class name
        predicted_class = class_names[predicted_index]

        # Optional: clean class name (remove prefix)
        predicted_class = predicted_class.replace(
            "Tomato___", "").replace("_", " ")

        return {
            "class": predicted_class,
            "confidence": round(confidence, 4)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
