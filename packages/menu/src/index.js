import React from 'react';
import { Image } from 'react-native';
import MenuCard from './MenuCard';
import createMenuScreen from './MenuScreen';

function calcTilt(idx, extent, length) {
  const interval = extent / ((length - 1) / 2);
  // const extent = interval * ((items.length - 1) / 2);
  const factor = extent - (Math.floor(idx / 2) * interval);
  return factor * (idx % 2 ? 1 : -1);
}


function calcScale(cardImage, bgImage) {
  const card = Image.resolveAssetSource(cardImage);
  const bg = Image.resolveAssetSource(bgImage);
  return {
    x: bg.height / card.width,
    y: bg.width / card.height,
  };
}

// Helper utilities
export function createCards(screens, tiltExtent = 4.5, anchor = 3000) {
  return screens.map(({ route, card, bg, onSelect }, idx) => (
    <MenuCard
      key={route}
      tilt={calcTilt(idx, tiltExtent, screens.length)}
      anchor={anchor}
      route={route}
      onSelect={onSelect}
      scale={calcScale(card, bg)}
    >
      <Image source={card} />
    </MenuCard>
  ));
}

export function createScreens(screens, containerStyle, tiltExtent = 4.5, anchor = 3000) {
  return screens.reduce((res, screen, idx) => {
    res[screen.route] = createMenuScreen(
      screen,
      {
        style: containerStyle,
        invScale: calcScale(screen.card, screen.bg),
        anchor,
        tilt: calcTilt(idx, tiltExtent, screens.length),
        dimension: Image.resolveAssetSource(screen.bg),
      }
    );
    return res;
  }, {});
}

export {
  MenuCard,
  createMenuScreen,
};

