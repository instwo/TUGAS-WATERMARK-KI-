function embedWatermark() {
    const imageInput = document.getElementById('imageUpload').files[0];
    const watermarkInput = document.getElementById('watermarkUpload').files[0];
    
    if (!imageInput || !watermarkInput) {
        alert('Please upload both the main image and the watermark image.');
        return;
    }

    const imageCanvas = document.createElement('canvas');
    const imageCtx = imageCanvas.getContext('2d');
    const watermarkCanvas = document.createElement('canvas');
    const watermarkCtx = watermarkCanvas.getContext('2d');

    const image = new Image();
    const watermark = new Image();

    image.src = URL.createObjectURL(imageInput);
    watermark.src = URL.createObjectURL(watermarkInput);

    image.onload = () => {
        imageCanvas.width = image.width;
        imageCanvas.height = image.height;
        imageCtx.drawImage(image, 0, 0);

        watermark.onload = () => {
            watermarkCanvas.width = image.width;
            watermarkCanvas.height = image.height;
            watermarkCtx.drawImage(watermark, 0, 0, image.width, image.height);

            const imageData = imageCtx.getImageData(0, 0, image.width, image.height);
            const watermarkData = watermarkCtx.getImageData(0, 0, image.width, image.height);

            for (let i = 0; i < imageData.data.length; i += 4) {
                imageData.data[i] = (imageData.data[i] & ~1) | (watermarkData.data[i] & 1);
                imageData.data[i + 1] = (imageData.data[i + 1] & ~1) | (watermarkData.data[i + 1] & 1);
                imageData.data[i + 2] = (imageData.data[i + 2] & ~1) | (watermarkData.data[i + 2] & 1);
            }

            const resultCanvas = document.getElementById('resultCanvas');
            const resultCtx = resultCanvas.getContext('2d');
            resultCanvas.width = image.width;
            resultCanvas.height = image.height;
            resultCtx.putImageData(imageData, 0, 0);

            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = resultCanvas.toDataURL();
            downloadLink.download = 'watermarked_image.png';
            downloadLink.style.display = 'block';
            downloadLink.textContent = 'Download Watermarked Image';
        };
    };
}

function extractWatermark() {
    const watermarkedImageInput = document.getElementById('watermarkedImageUpload').files[0];

    if (!watermarkedImageInput) {
        alert('Please upload the watermarked image.');
        return;
    }

    const watermarkedCanvas = document.createElement('canvas');
    const watermarkedCtx = watermarkedCanvas.getContext('2d');

    const watermarkedImage = new Image();
    watermarkedImage.src = URL.createObjectURL(watermarkedImageInput);

    watermarkedImage.onload = () => {
        watermarkedCanvas.width = watermarkedImage.width;
        watermarkedCanvas.height = watermarkedImage.height;
        watermarkedCtx.drawImage(watermarkedImage, 0, 0);

        const watermarkedData = watermarkedCtx.getImageData(0, 0, watermarkedImage.width, watermarkedImage.height);
        const extractedData = watermarkedCtx.createImageData(watermarkedImage.width, watermarkedImage.height);

        for (let i = 0; i < watermarkedData.data.length; i += 4) {
            extractedData.data[i] = (watermarkedData.data[i] & 1) * 255;
            extractedData.data[i + 1] = (watermarkedData.data[i + 1] & 1) * 255;
            extractedData.data[i + 2] = (watermarkedData.data[i + 2] & 1) * 255;
            extractedData.data[i + 3] = 255;
        }

        const extractedCanvas = document.getElementById('extractedCanvas');
        const extractedCtx = extractedCanvas.getContext('2d');
        extractedCanvas.width = watermarkedImage.width;
        extractedCanvas.height = watermarkedImage.height;
        extractedCtx.putImageData(extractedData, 0, 0);
    };
}
