/**
 * Normaliza la URL de una imagen
 * Si la URL es relativa, la convierte en una URL completa usando la base del API
 * Si la URL ya es completa, la retorna tal cual
 */
export function normalizeImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) {
    return null;
  }

  // Si la URL ya es completa (empieza con http:// o https://), retornarla tal cual
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Si es una ruta relativa, construir la URL completa
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  // Asegurar que la ruta tenga un slash inicial
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  
  return `${API_BASE_URL}${cleanPath}`;
}

