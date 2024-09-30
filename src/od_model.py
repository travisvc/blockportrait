import cv2
import torch
import numpy as np
from ultralytics import YOLO
from flask import Flask, Response
from flask_cors import CORS

device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f'Using device: {device}')

model = YOLO('yolov8s.pt') 

app = Flask(__name__)
CORS(app)

def generate_frames():
    cap = cv2.VideoCapture(0)

    while True:
        success, frame = cap.read()
        if not success:
            break

        results = model(frame)

        for result in results:
            boxes = result.boxes.xyxy  # Access bounding boxes
            confidences = result.boxes.conf  # Access confidences
            class_ids = result.boxes.cls  # Access class IDs

            for box, conf, cls in zip(boxes, confidences, class_ids):
                x1, y1, x2, y2 = map(int, box)
                label = f'{model.names[int(cls)]} {conf:.2f}'
                cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
                cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)