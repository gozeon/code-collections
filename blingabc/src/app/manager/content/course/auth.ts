import { ENV } from '../../../services/api.config';

export function courseAuth(): boolean {
  const name = JSON.parse(localStorage.getItem('info')).username;
  if (ENV === 'dev') {
    return false;
  }

  if (name === 'crmadmin' || name === 'dujuan' || name === 'zhaoying') {
    return false;
  } else {
    return true;
  }
}
