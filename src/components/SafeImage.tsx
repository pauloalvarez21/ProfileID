import React, { useState, useEffect, memo } from 'react';
import {
  Image, ImageStyle,
  ImageProps,
  ImageSourcePropType,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';

interface SafeImageProps extends Omit<ImageProps, 'source'> {
  source?: any;
  placeholder?: ImageSourcePropType;
  showLoader?: boolean;
}

const SafeImage = ({
  source,
  placeholder,
  style,
  showLoader = true,
  ...props
}: SafeImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultPlaceholder = placeholder || require('../../assets/images/profile.jpeg');

  useEffect(() => {
    setHasError(false);
  }, [source]);
  
  const isUriObject = typeof source === 'object' && source !== null && 'uri' in (source as any);
  const isLocalResource = typeof source === 'number';
  const hasValidUri = isUriObject && !!(source as any).uri && (source as any).uri.trim() !== '';

  // Si hay error, no hay source, o la URI es inválida, usamos el placeholder
  const shouldUsePlaceholder = hasError || !source || (!isLocalResource && !hasValidUri);

  const normalizedSource = (() => {
    if (shouldUsePlaceholder) return defaultPlaceholder;
    if (isLocalResource) return source;
    if (isUriObject) return { uri: (source as any).uri };
    return defaultPlaceholder;
  })();

  // Generamos una key basada en la uri para forzar el refresco si la imagen cambia
  const imageKey = isUriObject ? (source as any).uri : 'static-resource';

  // Extraemos las dimensiones y el radio para aplicarlos directamente a la imagen
  const flattenedStyle = StyleSheet.flatten(style) as ImageStyle;
  const imageStyle = [
    StyleSheet.absoluteFill,
    { 
      width: flattenedStyle?.width, 
      height: flattenedStyle?.height, 
      borderRadius: flattenedStyle?.borderRadius 
    }
  ];

  return (
    <View style={[styles.container, style, shouldUsePlaceholder && styles.fallbackBg]}>
      <Image
        {...props}
        // Cambiamos la key para forzar un re-montado completo si pasamos de red a local
        key={`${imageKey}-${shouldUsePlaceholder}`}
        style={imageStyle}
        resizeMode="cover"
        source={normalizedSource}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          if (__DEV__) console.warn('[SafeImage] Error al cargar la imagen de red.');
          setHasError(true);
          setLoading(false);
        }}
      />
      {loading && showLoader && !shouldUsePlaceholder && (
        <ActivityIndicator color="#4E576B" style={styles.loader} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#F1F4F8',
  },
  fallbackBg: {
    backgroundColor: '#E2E8F0',
  },
  loader: {
    position: 'absolute',
  },
});

export default memo(SafeImage);