import { Image } from 'react-native';

export default function calcScale(cardImage, bgImage) {
  const card = Image.resolveAssetSource(cardImage);
  const bg = Image.resolveAssetSource(bgImage);
  return {
    x: bg.height / card.width,
    y: bg.width / card.height,
  };
}
