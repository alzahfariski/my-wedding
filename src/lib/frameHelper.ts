/**
 * Composites a user image or live camera video stream with /assets/frame/frame_photobooth.png
 * Supports horizontal mirror flipping for front-camera selfie preview consistency.
 * Returns framed DataURL and File object ready for upload.
 */
export async function generateFramedImage(
  imageSource: string | HTMLImageElement | HTMLVideoElement,
  frameSrc: string = "/assets/frame/frame_photobooth.png",
  isMirrored: boolean = false
): Promise<{ dataUrl: string; file: File }> {
  return new Promise((resolve, reject) => {
    const frameImg = new window.Image();
    frameImg.crossOrigin = "anonymous";
    frameImg.src = frameSrc;

    frameImg.onload = () => {
      const targetWidth = frameImg.naturalWidth || 1080;
      const targetHeight = frameImg.naturalHeight || 1350;

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Gagal membuat canvas 2D context."));
        return;
      }

      const drawAndResolve = (photo: HTMLImageElement | HTMLVideoElement) => {
        let photoWidth = photo instanceof HTMLVideoElement ? photo.videoWidth : photo.naturalWidth;
        let photoHeight = photo instanceof HTMLVideoElement ? photo.videoHeight : photo.naturalHeight;

        if (!photoWidth || !photoHeight) {
          photoWidth = targetWidth;
          photoHeight = targetHeight;
        }

        // Calculate aspect fill ratio so image covers entire portrait canvas (1080x1350)
        const scale = Math.max(targetWidth / photoWidth, targetHeight / photoHeight);
        const x = (targetWidth - photoWidth * scale) / 2;
        const y = (targetHeight - photoHeight * scale) / 2;

        // 1. Draw photo centered (behind frame) with optional horizontal mirror flip
        if (isMirrored) {
          ctx.save();
          ctx.translate(targetWidth, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(photo, x, y, photoWidth * scale, photoHeight * scale);
          ctx.restore();
        } else {
          ctx.drawImage(photo, x, y, photoWidth * scale, photoHeight * scale);
        }

        // 2. Draw frame PNG on top (normal orientation, un-mirrored)
        ctx.drawImage(frameImg, 0, 0, targetWidth, targetHeight);

        // 3. Export PNG
        const dataUrl = canvas.toDataURL("image/png");
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `framed_photobooth_${Date.now()}.png`, {
                type: "image/png",
              });
              resolve({ dataUrl, file });
            } else {
              reject(new Error("Gagal membuat blob gambar ter-frame."));
            }
          },
          "image/png",
          1.0
        );
      };

      if (typeof imageSource === "string") {
        const photoImg = new window.Image();
        photoImg.crossOrigin = "anonymous";
        photoImg.src = imageSource;
        photoImg.onload = () => drawAndResolve(photoImg);
        photoImg.onerror = () => reject(new Error("Gagal memuat gambar foto."));
      } else {
        drawAndResolve(imageSource);
      }
    };

    frameImg.onerror = () => reject(new Error("Gagal memuat file frame photobooth."));
  });
}
