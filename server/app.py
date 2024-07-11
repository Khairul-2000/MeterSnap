import os
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

from flask import Flask, request, send_from_directory, jsonify
import os
from ultralytics import YOLO
from paddleocr import PaddleOCR
import cv2

app = Flask(__name__)
model = YOLO('newyolov8.pt')
ocr = PaddleOCR(use_angle_cls=True, lang='en')

@app.route('/predict', methods=['POST'])
def predict():
    if 'imageFile' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    imageFile = request.files['imageFile']
    if imageFile.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    image_path = os.path.join('images', imageFile.filename)
    imageFile.save(image_path)

    results = model(image_path)
    boxes = results[0].boxes  # Get the Boxes object from the results
    names = results[0].names  # Get the names of the classes
    meter_detected = False
    for box in boxes:
        class_id = int(box.cls)
        if names[class_id] == 'Meter':
            meter_detected = True
            break
        
    print(f"Meter detected: {meter_detected}")
    if meter_detected:
        print('Success')
        # Save the image with predictions
        results_img_path = os.path.join('pred_images', imageFile.filename)
        # if results[0].boxes.conf.tolist()[0] >.60:
        results[0].save(os.path.join('pred_images', imageFile.filename))
        # if results[0].boxes.conf.tolist()[0] >.60:
        boxes = results[0].boxes  # Get the Boxes object from the results
        names = results[0].names  # Get the names of the classes
       
        
        # # Loop through the detected bounding boxes and recognize digits
        try:
            final_reading = ''
            for box in boxes:
                class_id = int(box.cls[0])
                if names[class_id] == 'DigitBox':
                    x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())  # Convert to integers
                    img = cv2.imread(image_path)
                    digit_img = img[y1:y2, x1:x2]
                    digit_img = cv2.cvtColor(digit_img, cv2.COLOR_BGR2GRAY)
                    digit_img = cv2.GaussianBlur(digit_img, (5, 5), 0)
                    # Use PaddleOCR to recognize digits
                    result = ocr.ocr(digit_img, cls=True)
                    for line in result:
                        print(line)
                        digit = line[0][1][0]  # Extract the recognized digit
                        digit_str = str(digit)  # Ensure the digit is a string
                        final_reading += digit_str
            print(f"Final reading: {final_reading}")
        except:
            final_reading = 'Error: Unable to recognize digits, Try again!'

        if os.path.exists(results_img_path):
            print(f"Predicted image saved at: {results_img_path}")
        else:
            print("Error: Predicted image not saved.")
        return jsonify({'image_url': f'/pred_images/{imageFile.filename}', 'reading': final_reading})
    else:
        results_img_path = ''
        # if results[0].boxes.conf.tolist()[0] >.60:
        final_reading = ''
        if os.path.exists(results_img_path):
            print(f"Predicted image saved at: {results_img_path}")
        else:
            print("Error: Predicted image not saved.")

        return jsonify({'image_url': '', 'reading': ''})



    # if os.path.exists(results_img_path):
    #     print(f"Predicted image saved at: {results_img_path}")
    # else:
    #     print("Error: Predicted image not saved.")

    # return jsonify({'image_url': f'/pred_images/{imageFile.filename}', 'reading': final_reading})

@app.route('/pred_images/<filename>')
def display_image(filename):
    print(f"Serving image: {filename}")
    return send_from_directory('pred_images', filename)

if __name__ == '__main__':
    if not os.path.exists('images'):
        os.makedirs('images')
    if not os.path.exists('pred_images'):
        os.makedirs('pred_images')
    app.run(host='0.0.0.0', port=3000, debug=True)
