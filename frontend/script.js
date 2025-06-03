document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('previewContainer');
    const removeImage = document.getElementById('removeImage');
    const processBtn = document.getElementById('processBtn');
    const resultContainer = document.getElementById('resultContainer');
    const resultContent = document.getElementById('resultContent');
    const loading = document.getElementById('loading');
    const screenshotBtn = document.getElementById('screenshotBtn');

    // Handle drag and drop events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#bbdefb';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '';
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    // Handle click to upload
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });

    // Handle file selection
    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            previewContainer.style.display = 'block';
            processBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    // Handle remove image
    removeImage.addEventListener('click', () => {
        imagePreview.src = '';
        previewContainer.style.display = 'none';
        processBtn.disabled = true;
        resultContainer.style.display = 'none';
        fileInput.value = '';
    });

    // Handle process button click
    processBtn.addEventListener('click', async () => {
        try {
            loading.style.display = 'block';
            resultContainer.style.display = 'none';
            processBtn.disabled = true;

            const formData = new FormData();
            formData.append('image', fileInput.files[0]);

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                // Extract text from the response
                let displayText = '';
                if (data.candidates && data.candidates[0] && 
                    data.candidates[0].content && 
                    data.candidates[0].content.parts && 
                    data.candidates[0].content.parts[0]) {
                    displayText = data.candidates[0].content.parts[0].text;
                } else {
                    displayText = 'No text content found in the response.';
                }

                // Create a pre element for better text formatting
                const preElement = document.createElement('pre');
                preElement.textContent = displayText;
                resultContent.innerHTML = '';
                resultContent.appendChild(preElement);
                resultContainer.style.display = 'block';
            } else {
                throw new Error(data.error || 'Failed to process image');
            }
        } catch (error) {
            alert(error.message);
        } finally {
            loading.style.display = 'none';
            processBtn.disabled = false;
        }
    });

    // Add screenshot functionality
    screenshotBtn.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: 'always'
                },
                audio: false
            });

            const video = document.createElement('video');
            video.srcObject = stream;
            
            video.onloadedmetadata = () => {
                video.play();
                
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0);
                
                // Convert canvas to blob
                canvas.toBlob((blob) => {
                    // Create a File object from the blob
                    const file = new File([blob], 'screenshot.png', { type: 'image/png' });
                    
                    // Create a new FileList-like object
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    
                    // Update the file input
                    fileInput.files = dataTransfer.files;
                    
                    // Handle the file
                    handleFile(file);
                    
                    // Stop all tracks
                    stream.getTracks().forEach(track => track.stop());
                }, 'image/png');
            };
        } catch (error) {
            console.error('Error capturing screenshot:', error);
            alert('Failed to capture screenshot. Please make sure you have granted screen capture permissions.');
        }
    });
}); 