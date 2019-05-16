const handlebars = require("handlebars");
const repeat = require('./repeat');
handlebars.registerHelper('repeat', repeat);
var FakerData = require('./data')

const t1 = `
{
  data: {
    rows: [
      '{{#repeat 3}}',
      {
        inedex: '{{@index}}',
        name: '{{@faker.name_findName}}',
        uuid: '{{@faker.random_uuid}}'
      },
      '{{/repeat}}'
    ]
  },
  error: {
    returnCode: 0,
    returnMessage: 'success',
    returnUserMessage: '成功'
  }
}
`;

const t2 = "{\n\tdata: {\n\t    id: '{{faker.random_uuid}}'\n\t    rows: [\n\t    {{#repeat 5}}\n\t    {\n\t        inedex: {{@index}},\n\t        name: '{{@faker.name_findName}}'\n\t    }\n\t    {{/repeat}}\n\t  ]\n\t}\n}\n\n"

const p = handlebars.compile(t2);
const r = p({faker: new FakerData().getData()});

console.log(r);
// console.log(JSON.stringify(new FakerData().getData()))
