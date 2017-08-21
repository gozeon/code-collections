import * as gg from 'engine-api';

import { UIHud } from './hud';
import { UIPrint } from './print';
import Token from '../../token';

const contextInitOptions: gg.ContextInitOptions = {
  hud: new UIHud(),
  print: new UIPrint(),
  apiToken: Token.getToken()
};

gg.engineContext.init(contextInitOptions);
