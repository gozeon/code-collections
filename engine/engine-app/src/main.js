const exampleJSON = require('../node_modules/engine-api/example/examples.json');
const docsJSON = require('./docs.json');

import Api from './api';
import MiniStorage from './storage';
import uuid from 'uuid';
import Token from './token';
$(document).ready(function () {
  if (Token.getToken()) {

    $('div.main').css('opacity', '1');
    $('span#displayName').text(MiniStorage.getItem('name'));

    const editor = ace.edit("editor");
    ace.require("ace/ext/language_tools");
    editor.setOptions({
      tabSize: 2,
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });
    editor.setTheme("ace/theme/xcode");
    editor.getSession().setMode("ace/mode/javascript");

    async function getAllFiles() {
      const newID = uuid.v1();
      // $('#scripts').empty();
      $('#scripts').contents().filter(function () {
        return !$(this).is('#examplesTree');
      }).remove();
      $('#scripts').prepend(`<div id=${newID}></div>`);
      await Api.getAllFiles().then(data => {
        $(`#${newID}`).tree({
          closedIcon: $('<i class="fa fa-caret-right" aria-hidden="true"></i>'),
          openedIcon: $('<i class="fa fa-caret-down" aria-hidden="true"></i>'),
          autoEscape: false,
          data: [
            {
              label: '编辑',
              children: data.concat([
                { name: '<span class="button" todo="newfolder"><i class="fa fa-plus" aria-hidden="true"></i><a> New folder</a></span>' },
                { name: '<span class="button" todo="newfile"><i class="fa fa-plus" aria-hidden="true"></i><a> New file</a></span>' }
              ])
            }
          ]
        });

        $(`#${newID}`).bind(
          'tree.click',
          function (event) {
            if (event.node['type'] === 'blob') {
              Api.getFileContent(event.node.path).then(result => {
                setCode(result['fileName'], result['content'], result['filePath']);
              });
            }
          }
        );

        $('span.button').click(function () {
          switch ($(this).attr('todo')) {
            case 'newfolder':
              todoCreate('newfolder');
              break;
            case 'newfile':
              todoCreate('newfile');
              break;
            default:
              return;
          }
        });
      });
    }
    getAllFiles();

    $('#scripts').append('<div id="examplesTree"></div>');

    $('#examplesTree').tree({
      closedIcon: $('<i class="fa fa-caret-right" aria-hidden="true"></i>'),
      openedIcon: $('<i class="fa fa-caret-down" aria-hidden="true"></i>'),
      data: [{
        name: '示例',
        children: exampleJSON
      }]
    });

    $('#examplesTree').bind(
      'tree.click',
      function (event) {
        if (event.node.hasOwnProperty('code')) {
          setCode(event.node.name, event.node.code)
        }
      }
    );

    $('#submitBtn').click(function () {
      let geometry = '';
      if (window.geometry) {
        geometry = `var geometry = ${JSON.stringify(geometry)};\n`;
      }
      Api.runCode(geometry + editor.getValue())
        .then(result => {
          if ($('#tempScripts').get(0)) {
            $('#tempScripts').remove();
          }

          $(`<script id="tempScripts">${Function(editor.getValue())}anonymous()</script>`).appendTo(document.body);
        })
        .catch(error => {
          if (error.response) {
            const errors = error.response.data.errors;
            const anots = [];

            for (let i = 0; i < errors.length; i++) {
              const tmp = {
                row: errors[i]["position"][0] - 3,
                column: errors[i]["position"][1],
                text: errors[i]["message"],
                type: "error"
              }
              anots.push(tmp);
            }

            anots.forEach(item => print(new Error(item.text)));
            editor.getSession().setAnnotations(anots);
          }
        });
    })

    $('#saveBtn').click(function () {
      if ($('#editorHead').attr('path')) {
        Api.updateFileContent($('#editorHead').attr('path'), editor.getValue())
          .then(result => {
            if (+result['code'] === 200) {
              getAllFiles();
            }
          })
      } else {
        todoCreate('saveExample');
      }

    })

    $('#exportBtn').click(function () {
      Api.runCode(editor.getValue())
        .then(result => {
          print({
            text: `Export`,
            url: result['exportUrl']
          })
        })
        .catch(error => {
          if (error.response) {
            const errors = error.response.data.errors;
            const anots = [];

            for (let i = 0; i < errors.length; i++) {
              const tmp = {
                row: errors[i]["position"][0] - 4,
                column: errors[i]["position"][1],
                text: errors[i]["message"],
                type: "error"
              }
              anots.push(tmp);
            }

            anots.forEach(item => print(new Error(item.text)));
            editor.getSession().setAnnotations(anots);
          }
        });
    })

    $('#directoryUL > li').click(function () {
      $('#directoryUL > li').removeClass('directory-ul-actived');
      $(this).addClass('directory-ul-actived');
      $('#directoryContent > div').hide();
      $('#directoryContent > div').eq($(this).index()).show();
    })

    $('#docTree').tree({
      closedIcon: $('<i class="fa fa-caret-right" aria-hidden="true"></i>'),
      openedIcon: $('<i class="fa fa-caret-down" aria-hidden="true"></i>'),
      data: docsJSON
    });

    $('#docTree').bind(
      'tree.click',
      function (event) {
        if (event.node) {
          // node was selected
          if (event.node.children.length === 0) {
            const data = event.node.data;
            $('#docTemplate')
              .css({
                top: event.click_event.clientY - 10,
                left: 10,
                display: 'block'
              })
            $('#docTemplate').find('#name').text(event.node.name)
            $('#docTemplate').find('#descripttion').text(data.description)
            $('#docTemplate').find('#returns').text(data.returns)
            for (let i = 0; i < data.arguments.length; i++) {
              $(`<h4>- ${data.arguments[i].name}(${data.arguments[i].type})<h4>`)
                .css("padding", "0 10px")
                .appendTo($('#arguments'))
              $(`<p>${data.arguments[i].description}</p>`)
                .css("padding-left", "20px")
                .appendTo($('#arguments'))
            }
            $('#close').click(function () {
              closeDocTemplate();
            })

            event.click_event.stopPropagation();
          }
        }
      }
    );

    $('div#model').find($('button.yes')).click(function () {
      let name = $('div#model').find($('input')).val();
      let code = '';
      if (name && $('div#model').find($('button.yes')).attr('todo')) {
        if ($('div#model').find($('button.yes')).attr('todo') == 'folder') {
          name = name + '\/.gitkeep';
        }
        if ($('div#model').find($('button.yes')).attr('todo') == 'saveExample') {
          let geometry = '';
          if (window.geometry) {
            geometry = `var geometry = ${JSON.stringify(geometry)};\n`;
          }
          code = geometry + editor.getValue();
        }
        Api.createFile(name, code).then(result => {
          if (+result['code'] === 200) {
            closeModel();
            getAllFiles();
          }
        }).catch(err => {
          $('div#modeMsg').text(err.response.data.error.message);
        })
      }
    });

    $('div#model').find($('button.no')).click(function () {
      closeModel();
    });

    $('div#model').find('i').click(function () {
      closeModel();
    });

    $('#signOut').click(function () {
      logout()
    });

    $(window).click(function () {
      if ($('#docTemplate').css('display') == 'block') {
        closeDocTemplate();
      }
    })

    function setCode(name, code, path) {
      $('#editorHead').text(name);
      editor.setValue(code);
      if (path) {
        $('#editorHead').attr('path', path);
      } else {
        $('#editorHead').removeAttr('path');
      }
    }

    function closeDocTemplate() {
      $('#docTemplate').hide();
      $('#arguments').empty();
    }

    function todoCreate(type) {
      if (type) {
        switch (type) {
          case 'newfolder':
            $('div#model').find('h4').text('New Folder');
            $('div#model').find('span').text('new folder');
            $('div#model').find('button').attr('todo', 'folder');
            break;
          case 'newfile':
            $('div#model').find('h4').text('New File');
            $('div#model').find('span').text('new file');
            $('div#model').find('button').attr('todo', 'file');
            break;
          case 'saveExample':
            $('div#model').find('h4').text('New File');
            $('div#model').find('span').text('new file');
            $('div#model').find('button').attr('todo', 'saveExample');
            $('div#model').find($('input')).val($('#editorHead').text());
            $('div#model').find($('input')).prop('disabled', true);
            break;
          default:
            return;
        }
        $('div#model').css('display', 'flex');
      }
    }

    function closeModel() {
      $('div#model').find('h4').text('');
      $('div#model').find('span').text('');
      $('div#model').find('input').val('Untitled');
      $('div#model').find($('input')).prop('disabled', false);
      $('div#model').find('button').removeAttr('todo');
      $('div#model').hide();
      $('div#modeMsg').text('')
    }

    function logout() {
      MiniStorage.clean();
      location.reload();
    }
  }
})
