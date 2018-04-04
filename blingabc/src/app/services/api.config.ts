import { environment } from '../../environments/environment';

export const API_V1: string = environment.API;
export const ENV: string = environment.production ? 'prod' : 'dev';
