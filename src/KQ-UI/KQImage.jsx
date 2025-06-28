//* KQImage.jsx

import React from 'react';
import FastImage from 'react-native-fast-image';

const KQImage = ({image, ...props}) => {
  return (
    <FastImage
      source={{
        uri: `https://firebasestorage.googleapis.com/v0/b/kitchen-queue-fe2fe.firebasestorage.app/o/recipes%2F${encodeURIComponent(
          image,
        )}?alt=media`,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.web,
      }}
      resizeMode={FastImage.resizeMode.cover}
      {...props}
    />
  );
};

export default __DEV__ ? KQImage : React.memo(KQImage);
