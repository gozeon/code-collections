
/**
 * 验证邮箱格式
 * @param email
 */
export const validatorEmail = (email: string): boolean => {
  const tester = /^([\w-_]+(?:\.[\w-_]+)*)@([A-Za-zd0-9]+[-.])+[A-Za-zd]{2,5}$/;
  if (!email) {
    return false;
  }

  if (email.length > 254) {
    return false;
  }

  const valid = tester.test(email);
  if (!valid) {
    return false;
  }

  // Further checking of some things regex can't handle
  const parts = email.split('@');
  if (parts[0].length > 64) {
    return false;
  }

  const domainParts = parts[1].split('.');
  if (domainParts.some(function (part) { return part.length > 63; })) {

    return false;
  }

  return true;
};

/**
 * 验证手机号
 * @param phone
 */
export const validatorPhoneNumber = (phone: number): boolean => {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (phone) {
    return reg.test(String(phone));
  } else {
    return false;
  }
};
