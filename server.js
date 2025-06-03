const express = require('express');
const multer = require('multer');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3000;

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
        }
    }
});

// Serve static files
app.use(express.static('frontend'));

// Handle file upload
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Webhook URL
        const webhookUrl = 'http://localhost:5678/webhook/fda7b612-3936-4543-96d6-01711b47b021';

        // Send the image to the webhook as binary data
        const response = await axios.post(webhookUrl, req.file.buffer, {
            headers: {
                'Content-Type': req.file.mimetype,
                'Content-Length': req.file.size
            },
            timeout: 30000 // 30 seconds timeout
        });

        // Send the webhook response back to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.status(error.response.status).json({ 
                error: 'Webhook processing failed',
                details: error.response.data
            });
        } else if (error.request) {
            // The request was made but no response was received
            res.status(500).json({ 
                error: 'No response from webhook server',
                details: 'The webhook server did not respond. Please try again later.'
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            res.status(500).json({ 
                error: 'Failed to process image',
                details: error.message
            });
        }
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 