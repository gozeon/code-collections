// Please press Command + Enter to fake data,
// Author goze goze.qiu@gmail.com
// see faker doc https://github.com/Marak/faker.js#api-methods

const example =
`{
  "data": {
    "database": "{{faker.database_engine}}",
    "rows": [
      {{#repeat 3}}
      {
        "inedex": {{@index}},
        "name": "{{@faker.name_findName}}",
        "uuid": "{{@faker.random_uuid}}"
      },
      {{/repeat}}
    ]
  },
  "error": {
    "returnCode": 0,
    "returnMessage": "success",
    "returnUserMessage": "成功"
  }
}
`;

export default example;
