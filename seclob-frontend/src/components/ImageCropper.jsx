import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss'

// Add these styles at the top of your file or in a separate CSS file
const styles = `
.crop-buttons {
    gap: 10px;
    justify-content: center;
    margin-top: 15px;
}

.crop-apply-btn {
    padding: 8px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.3s ease;
    margin-bottom:1rem;
}

.crop-apply-btn:hover {
    background-color: #45a049;
}

.crop-cancel-btn {
    padding: 8px 20px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.3s ease;
}

.crop-cancel-btn:hover {
    background-color: #da190b;
}

.crop-container {
    max-width: 100%;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 4px;
}
`;

const ImageCropper = ({ imageUrl, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 90,
    aspect: 1
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const getCroppedImage = () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    // Get the original image format
    const originalFormat = imgRef.current.src.split(';')[0].split('/')[1];
    
    // Choose appropriate MIME type
    let mimeType;
    switch(originalFormat.toLowerCase()) {
        case 'png':
            mimeType = 'image/png';
            break;
        case 'gif':
            mimeType = 'image/gif';
            break;
        case 'webp':
            mimeType = 'image/webp';
            break;
        default:
            mimeType = 'image/jpeg';
    }

    canvas.toBlob(blob => {
        if (blob) {
            onCropComplete(URL.createObjectURL(blob));
        }
    }, mimeType, 1.0); // 1.0 is the quality parameter (max quality)
};

  return (
    <>
      <style>{styles}</style>
      <div className="selected-images">
        <div className="crop-container">
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={c => setCompletedCrop(c)}
            aspect={1}
          >
            <img
              ref={imgRef}
              src={imageUrl}
              style={{ maxWidth: '100%' }}
              alt="Crop preview"
            />
          </ReactCrop>
        </div>
        <div className="crop-buttons">
          <button
            className="crop-apply-btn"
            onClick={getCroppedImage}
          >
            Apply Crop
          </button>
          <button
            className="crop-cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default ImageCropper;