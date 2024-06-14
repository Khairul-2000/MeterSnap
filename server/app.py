from flask import Flask, request, send_from_directory, jsonify
import torch
import os

app = Flask(__name__)
model = torch.hub.load('ultralytics/yolov5', 'custom', path='myModel.pt')

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
    results_img_path = os.path.join('pred_images', imageFile.filename)
    results.save(save_dir='pred_images', exist_ok=True)

    if os.path.exists(results_img_path):
        print(f"Predicted image saved at: {results_img_path}")
    else:
        print("Error: Predicted image not saved.")

    return jsonify({'image_url': f'/pred_images/{imageFile.filename}'})

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
