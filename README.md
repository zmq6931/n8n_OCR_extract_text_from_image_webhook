# OCR Webhook Application

A simple web application that allows users to upload images and process them through a webhook for OCR (Optical Character Recognition) using n8n.

## Features

- Clean, modern UI with blue and white color scheme
- Drag and drop image upload
- Image preview before processing
- Webhook integration with n8n for OCR processing
- Responsive design
- Support for JPEG, PNG, and GIF images

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- n8n instance running with OCR webhook

## Setup

1. Clone the repository:

```bash
git clone https://github.com/zmq6931/n8n_OCR_extract_text_from_image_webhook.git
cd n8n_OCR_extract_text_from_image_webhook
```

2. Install dependencies:

```bash
npm install
```

3. Configure the webhook URL:

   - Open `server.js`
   - Replace the webhook URL with your n8n webhook URL:

   ```javascript
   const webhookUrl = 'http://localhost:5678/webhook/your-webhook-id';
   ```
4. Start the server:

```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Click on the upload area or drag and drop an image
2. Preview the image
3. Click "Process Image" to send it to the n8n webhook
4. View the OCR recognition results

## Technical Details

- Built with Node.js and Express
- Uses multer for file upload handling
- Frontend built with vanilla JavaScript
- Supports JPEG, PNG, and GIF images
- Maximum file size: 5MB
- Sends images as binary data to the webhook
- Displays only the extracted text from the OCR results

## Project Structure

```
ocr-webhook-app/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── upload-icon.svg
├── server.js
├── package.json
└── README.md
```

## License

MIT License

## Contributing

Feel free to submit issues and enhancement requests!
