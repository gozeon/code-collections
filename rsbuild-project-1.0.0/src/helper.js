export const isImage = (url) => {
  // eslint-disable-next-line no-useless-escape
  const base64ImageRegex =
    /^data:image\/(png|jpeg|jpg|gif|bmp|webp);base64,[A-Za-z0-9+\/=]+$/;
  const imageUrlRegex =
    /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,6}(\/[^\s]*)*\.(jpg|jpeg|png|gif|bmp|webp)$/i;
  return imageUrlRegex.test(url) || base64ImageRegex.test(url);
};

export const previewImageUrl = (message) => {
  let imageurl = message;
  if (isImage(imageurl)) {
    try {
      const u = new URL(message);
      u.searchParams.set('x-oss-process', 'image/resize,w_200/format,webp');
      imageurl = u.toString();
    } catch (e) {
      imageurl = message;
    }
  }

  return imageurl;
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
