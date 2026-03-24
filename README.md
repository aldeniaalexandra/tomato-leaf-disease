# Tomato Leaf Disease Detection

A deep learning–based web application that classifies tomato leaf diseases from uploaded photos. Built with TensorFlow (EfficientNetB0), served via a FastAPI backend on Google Cloud Run, and deployed as a static frontend on Firebase Hosting.

---

## Live Demo

| | URL |
|---|---|
| Frontend | https://tomato-leaf-disease-490500.web.app |
| API | https://tomato-leaf-disease-550914102938.asia-southeast1.run.app |
| API Docs (Swagger) | https://tomato-leaf-disease-550914102938.asia-southeast1.run.app/docs |

---

## Features

- Classifies tomato leaf images into 10 categories (9 diseases + healthy)
- 99.2% test accuracy on the PlantVillage dataset
- Inference time under 2 seconds
- REST API with `/predict` endpoint
- Drag-and-drop image upload with live preview
- Confidence score with a visual bar indicator
- Disease descriptions shown alongside the diagnosis
- Fully containerized with Docker

---

## Disease Classes

| Class | Description |
|---|---|
| Bacterial Spot | Water-soaked spots with yellow halos caused by *Xanthomonas* bacteria |
| Early Blight | Concentric dark rings on older leaves caused by *Alternaria solani* |
| Late Blight | Fast-spreading lesions caused by *Phytophthora infestans* |
| Leaf Mold | Olive-green mold on leaf undersides caused by *Passalora fulva* |
| Septoria Leaf Spot | Circular spots with light centers caused by *Septoria lycopersici* |
| Spider Mites | Stippled, yellowing leaves from two-spotted spider mite infestation |
| Target Spot | Bullseye-patterned lesions caused by *Corynespora cassiicola* |
| Yellow Leaf Curl Virus | Upward-curling yellowed leaves spread by whiteflies |
| Mosaic Virus | Mottled light/dark green patterns spread by contact |
| Healthy | No disease detected |

---

## Project Structure

```
tomato-leaf-disease/
├── main.py                        # FastAPI application (prediction endpoint)
├── best_model.keras               # Trained EfficientNetB0 model
├── class_names.json               # Ordered list of class labels
├── requirements.txt               # Python dependencies
├── Dockerfile                     # Container definition for Cloud Run
├── firebase.json                  # Firebase Hosting configuration
├── .firebaserc                    # Firebase project binding
├── tomato-leaf-disease.ipynb      # Training and evaluation notebook
├── public/
│   └── index.html                 # Frontend UI (single-page app)
└── img/
    ├── training_history.png
    ├── confusion_matrix.png
    └── sample_viz.png
```

---

## API Reference

### `GET /`

Health check.

**Response:**
```json
{ "status": "ok" }
```

### `POST /predict`

Accepts a tomato leaf image and returns the predicted class and confidence score.

**Request:** `multipart/form-data` with a `file` field (`.jpg`, `.jpeg`, or `.png`).

**Response:**
```json
{
  "class": "Early Blight",
  "confidence": 0.9871
}
```

**Error responses:**
- `400` — unsupported file type
- `500` — internal server error

---

## Running Locally

### Prerequisites

- Python 3.10+
- pip

### Steps

1. Clone the repository and navigate into the project folder.

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the API server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8080
   ```

4. Open `public/index.html` directly in your browser, or serve it with any static file server. The frontend is pre-configured to call the deployed Cloud Run URL; update the `API_URL` constant in `index.html` to `http://localhost:8080/predict` for local testing.

---

## Running with Docker

```bash
# Build the image
docker build -t tomato-leaf-disease .

# Run the container
docker run -p 8080:8080 tomato-leaf-disease
```

The API will be available at `http://localhost:8080`.

---

## Deployment

### Backend — Google Cloud Run

```bash
# Build and push to Artifact Registry (adjust the project and region as needed)
gcloud builds submit --tag gcr.io/<PROJECT_ID>/tomato-leaf-disease

# Deploy to Cloud Run
gcloud run deploy tomato-leaf-disease \
  --image gcr.io/<PROJECT_ID>/tomato-leaf-disease \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated
```

### Frontend — Firebase Hosting

```bash
# Install Firebase CLI if needed
npm install -g firebase-tools

firebase login
firebase deploy --only hosting
```

---

## Model Details

| Attribute | Value |
|---|---|
| Architecture | EfficientNetB0 (transfer learning) |
| Input size | 224 × 224 RGB |
| Output | Softmax over 10 classes |
| Dataset | PlantVillage (tomato subset) |
| Test accuracy | 99.2% |

The training process, data augmentation pipeline, and evaluation metrics are documented in `tomato-leaf-disease.ipynb`.

---

## Dependencies

```
fastapi
uvicorn
tensorflow
pillow
numpy
python-multipart
```
