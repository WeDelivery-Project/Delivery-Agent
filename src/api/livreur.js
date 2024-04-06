import { Request } from './config';

export const tryLoginWithToken = async () => {
  try {
    const res = await Request.get('/livreur/token');
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loginRequest = async (login) => {
  try {
    const res = await Request.post('/livreur/login', login);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
