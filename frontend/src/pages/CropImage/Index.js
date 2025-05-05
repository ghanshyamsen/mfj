import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';
import Modal from 'react-bootstrap/Modal';

import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from './useDebounceEffect'

const ProfileImageCrop = ({ imageSrc, onCropComplete, onClose, onShow }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const previewCanvasRef = useRef(null)
  const imgRef = useRef(null)
  const blobUrlRef = useRef('')

  const [scale, setScale] = useState(1)
  const [aspect, setAspect] = useState(16 / 16)

  // Manually load the image to ensure we have the correct reference
  const loadImage = useCallback(() => {
    const img = new Image();
    //console.log('Image dimensions:', img.naturalWidth, img.naturalHeight);
    // Set crossOrigin to anonymous
    img.crossOrigin = 'anonymous';

    img.src = imageSrc;
    img.onload = () => {
      setImageRef(img);
    };
    img.onerror = (err) => {
      console.error('Error loading image:', err);
    };
  }, [imageSrc]);


  useEffect(() => {
    if (imageSrc) {
      loadImage();
    }
  }, [imageSrc, loadImage]);

  const onCropChange = (newCrop) => {
    // Ensure the crop aspect ratio is maintained
    setCrop(newCrop);
  };

  const onCropCompleteInternal = (crop) => {
    setCompletedCrop(crop);
  };

  const getExtensionFromUrl = (url) => {
    return url.substring(url.lastIndexOf('.') + 1).toLowerCase();
  };

  // Helper function to get MIME type from file extension
  const getMimeTypeFromExtension = (extension) => {
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      default:
        return 'image/jpeg'; // Default fallback
    }
  };

  const getCroppedImage = async () => {

    const previewCanvas = previewCanvasRef.current
    const image = imgRef.current

    if (!completedCrop || !imageRef || !previewCanvas) {
      console.error('Invalid crop data or image reference:', completedCrop, image);
      return null;
    }

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Log scaling and crop data
    // console.log('Scale X:', scaleX, 'Scale Y:', scaleY);
    // console.log('Completed Crop:', completedCrop);

    // canvas.width = completedCrop.width * scaleX;
    // canvas.height = completedCrop.height * scaleY;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    )
    const ctx = offscreen.getContext('2d')

    try {

      ctx.drawImage(
        previewCanvas,
        0,
        0,
        previewCanvas.width,
        previewCanvas.height,
        0,
        0,
        offscreen.width,
        offscreen.height,
      )
    } catch (error) {
      console.error('Error drawing image on canvas:', error);
      return null;
    }

    const blob = await offscreen.convertToBlob({
      type: 'image/png',
    });

    const croppedImageUrl = URL.createObjectURL(blob);

    return { blob, croppedImageUrl }
  };

  function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
  ) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    )
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale
        )
      }
    },
    100,
    [completedCrop, scale],
  )

  const handleCropButtonClick = async () => {
    try {
      const croppedImage = await getCroppedImage();
      if (croppedImage) {
        onCropComplete(croppedImage);
        onClose();
      }
    } catch (error) {
      //console.error('Error while cropping the image:', error);
      window.showToast('Error while cropping the image: Please select a cropping area by clicking and dragging to create a box. Then, click "Crop" to proceed.','error');
    }
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  return (
    <Modal className='reactcrop_modal' show={onShow} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Crop Your Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {imageSrc && (

          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={onCropCompleteInternal}
            aspect={aspect}
            //minWidth={400}
            minHeight={100}
            circularCrop
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imageSrc}
              style={{ transform: `scale(${scale})` }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        )}

        {completedCrop &&
          <div>
            <canvas
              ref={previewCanvasRef}
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                width: completedCrop.width,
                height: completedCrop.height,
              }}
            />
          </div>
        }
        <div className='btn_block' style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type='button' className='btn submit_btn back-button' onClick={onClose} style={{ marginRight: '10px' }}>
            Close
          </button>
          <button type='button' className='btn submit_btn' onClick={handleCropButtonClick}>
            Crop
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileImageCrop;
