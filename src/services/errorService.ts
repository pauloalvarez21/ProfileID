/**
 * Normaliza errores de Axios/Servidor a un formato estándar para la UI.
 */
export interface NormalizedError {
  message: string;
  status?: number;
  isNetworkError?: boolean;
}

export const parseApiError = (error: any): NormalizedError => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    const serverMessage = (data?.message || data?.error || data?.msg || '').toLowerCase();

    // 1. Mapeo por Status Code o Contenido (resiliente)
    if (status === 409 || serverMessage.includes('registrado') || serverMessage.includes('exists')) {
      return { message: 'editProfile.errors.emailExists', status };
    }
    
    if (status === 404) return { message: 'editProfile.errors.syncEndpointNotFound', status };
    if (status === 429) return { message: 'login.errors.tooManyRequests', status };
    if (status >= 500) return { message: 'common.serverError', status };

    // Si no hay mapeo, devolvemos el mensaje del servidor o uno genérico
    return { message: data?.message || 'common.error', status };
  }
  
  if (error.request) {
    return { message: 'errors.networkError', isNetworkError: true };
  }
  
  return { message: error.message || 'common.error' };
};