// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require( 'fs' );
const path = require( 'path' );
const { exec } = require( 'child_process' );
const { shell } = require( 'electron' );
const $ = window.$;
const ctx = {};

$.fn.ignore = function ( sel ) {
  return this.clone().find( sel || ">*" ).remove().end();
};

const utils = {
  setTitle: function ( title ) {
    document.title = title;
  },
  time: function () {
    const date = new Date();
    const y = date.getFullYear();
    const M = date.getMonth();
    const d = date.getDate();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    return `[${y}/${M}/${d} ${h}:${m}:${s}]`;
  },
  existsPtah: function ( path ) {
    return fs.existsSync( path );
  },
  openBrowser: function ( url ) {
    shell.openExternal( url );
  }
};

$( function () {

  // css col底部对齐 see style.css
  $( '.col-align-down' ).parent().css( 'position', 'relative' );

  // 打开浏览器
  $( 'a' ).each( function ( index ) {
    if (this.getAttribute( 'mode' ) === 'browser') {
      $( this ).click( function ( e ) {
        e.preventDefault();
        utils.openBrowser( this.href );
      } )
    }
  } );

  // $( '.content' ).hide();

  // 选项目
  $( '#selectProjectBtn' ).click( function () {
    _getPath()
  } );
  $( '#selectProjectBtnLg' ).click( function () {
    _getPath()
  } );

  /**
   * 获取目录
   */
  function _getPath() {
    const tmp = dialog.showOpenDialog( { properties: [ 'openDirectory' ] } );
    const bool = !!tmp;
    if (bool) {
      ctx.projectPath = tmp[ 0 ];
      const pkgPath = path.join( ctx.projectPath, 'package.json' );

      if (utils.existsPtah( pkgPath )) {
        utils.setTitle( ctx.projectPath );
        $( '.content' ).show();
        $( '.jumbotron' ).hide();
        _pkgRender( require( pkgPath ) );
      } else {
        dialog.showErrorBox( 'No Package.json', 'Please select folder again!' );
      }
    }
  }

  /**
   * 解析package.json
   * @param pkg
   */
  function _pkgRender( pkg ) {
    $( '#scriptsGroup' ).append()

    if (pkg.scripts) {
      let keys = Object.keys( pkg.scripts );

      for (let i = 0; i < keys.length; i++) {
        $( '#scriptsGroup' ).append( `<button class="btn btn-primary btn-circle">${keys[ i ]}</button>` );
      }
      _scriptsAddClick()
    }
  }

  /**
   * script 点击事件
   * @private
   */
  function _scriptsAddClick() {

    $( '#scriptsGroup' ).children().each( function ( index ) {

      $( this ).click( function ( e ) {
        if (ctx[ 'start' ]) {
          console.log(ctx.start);
          ctx.start.kill();
        }
        const name = $( this ).text();
        $( this ).prop( 'disabled', true ).removeClass( 'btn-primary' ).addClass( 'btn-success' );
        $( '#logName>li.active' ).removeClass( 'active' );
        $( '#logContent>pre.active' ).removeClass( 'active' );

        if (!$( `#${name}` ).length) {
          $( '#logName' ).append( `<li role="presentation" class="active" id="${name}Li"><a href="#${name}" data-toggle="tab">${name}</a></li>` );
          $( '#logContent' ).append( `<pre id="${name}" class="tab-pane active"></pre>` );
        }
        $( `#${name}Li` ).addClass( 'active' );
        $( `#${name}` ).addClass( 'active' );

        // TODO: RUN BASH
        _runScript( this )
      } )
    } )
  }

  function _runScript( el, command = 'a' ) {
    const npmScriptName = $( el ).text();
    const cdCommand = `cd ${ctx.projectPath}`;
    const npmCommand = `${cdCommand} && npm run ${npmScriptName}`;
    const scriptProcess = exec( npmCommand );
    const logEl = $( `#${npmScriptName}` );

    scriptProcess.stdout.on( 'data', function ( data ) {
      logEl.text( logEl.text() + data.toString() );
    } );

    scriptProcess.stderr.on( 'data', function ( data ) {
      if(data) {
        $( el ).prop( 'disabled', false ).removeClass( 'btn-success' ).addClass( 'btn-danger' );
      }
      logEl.text( logEl.text() + data.toString() );
    } );

    scriptProcess.on( 'close', function ( code ) {
      $( el ).prop( 'disabled', false ).removeClass( 'btn-success' ).addClass( 'btn-primary' );
      logEl.text( logEl.text() + `[npm run ${npmScriptName}]: child process exited with code ${code}` );
    } );

    ctx[ npmScriptName ] = scriptProcess;
  }

} );

// let projectPath;
// const pickFolder = document.querySelector( '#pickFolder' );
// const npm = document.querySelector( '#npm' );
// const logEle = document.querySelector( '#log' );
//
// function log( msg, isTime = true ) {
//   logEle.style.display = 'block';
//   let time = isTime ? utils.time() : '';
//   logEle.textContent = logEle.textContent + '\n' + time + msg;
// }
//
//
// pickFolder.addEventListener( 'click', function ( e ) {
//   const tmp = dialog.showOpenDialog( { properties: [ 'openDirectory' ] } );
//   const bool = !!tmp;
//   if (bool) {
//     projectPath = tmp[ 0 ];
//     const pkgPath = path.join( projectPath, 'package.json' );
//
//     if (utils.existsPtah( pkgPath )) {
//       utils.setTitle( projectPath );
//       pkgRender( require( pkgPath ) );
//     } else {
//       dialog.showErrorBox( 'No Package.json', 'Please select folder again!' );
//     }
//   }
// }, false );
//
// function pkgRender( pkg ) {
//   npm.innerHTML = '';
//   const box = document.createElement( 'div' );
//
//   if (pkg.scripts) {
//     let keys = Object.keys( pkg.scripts );
//     let c = document.createElement( 'div' );
//
//     // TODO: 是在这里提供npm install按钮, 还是选择项目的时候自动install.
//     for (let i = 0; i < keys.length; i++) {
//       let span = document.createElement( 'span' );
//       span.classList.add( 'script-name' );
//       span.innerText = keys[ i ];
//       span.addEventListener( 'click', handleClick, false );
//       c.appendChild( span );
//     }
//
//     box.appendChild( c );
//   }
//
//   if (pkg.dependencies) {
//   }
//   if (pkg.devDependencies) {
//   }
//
//   npm.append( box );
// }
//
// function handleClick( e ) {
//   e.target.classList.add( 'active' );
//   const scriptName = e.target.textContent;
//   // log(scriptName);
//   runScript( `npm run ${scriptName}`, e.target );
// }
//


