import { useState, useEffect } from 'react';

export function useCameraSupport() {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si el navegador soporta getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
      setError('Tu navegador no soporta acceso a la cámara');
      return;
    }

    // Verificar si estamos en un contexto seguro (HTTPS o localhost)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setIsSupported(false);
      setError('La cámara requiere una conexión segura (HTTPS)');
      return;
    }

    // Intentar enumerar dispositivos para verificar si hay cámaras disponibles
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        if (!hasCamera) {
          setIsSupported(false);
          setError('No se detectó ninguna cámara en tu dispositivo');
        }
      })
      .catch(() => {
        // Si no podemos enumerar dispositivos, asumimos que está soportado
        // El error real se manejará cuando intentemos acceder a la cámara
        setIsSupported(true);
      });
  }, []);

  return { isSupported, error };
}
