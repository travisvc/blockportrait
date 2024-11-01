import cv2
import torch
from ultralytics import YOLO

device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f'Using device: {device}')

model = YOLO('yolov8s.pt')

def process_frame(frame):
    """
    Process a single frame with the YOLO model, draw bounding boxes and labels, and return the frame.
    """
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

    return frame
