// import Handlebars from "handlebars";
import Handlebars from 'handlebars/dist/cjs/handlebars'

import registerHelper from "./repeat";

Handlebars.registerHelper("repeat", registerHelper);

export default Handlebars;

