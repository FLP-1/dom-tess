// useGeolocation.js
import { useState } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);

  const askLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocalização não suportada');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });
          resolve({ latitude, longitude });
        },
        err => reject('Permissão negada ou erro ao obter localização')
      );
    });

  return [location, askLocation];
};

