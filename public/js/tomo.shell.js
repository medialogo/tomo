/*
 * tomo.shell.js
 * tomoのシェルモジュール
*/

/*jslint  browser : true, continue : true,
  devel : true, indent :2, maxerr : 50,
  newcap: true, nomen :true, plusplus : true,
  regexp : true, sloppy : true, vars : false,
  white  : true
*/

/*global $, tomo */

tomo.shell =(function () {
  //-------- モジュールスコープ変数開始 ------------
  var configMap = {
      main_html1 : String()
        + '<header>'
          + '<div class="tomo-shell-head" >'
            + '<div class="tomo-shell-head-logo"><span>Todo meMo</span></div>'
          + '</div>'
         + '</header>'
        + '<div id="tomo-shell-main" >',
/*           + '<div class="tomo-shell-main-nav">'
            + '<div class="tomo-shell-main-command">'
              + '<ul>'
                + '<li><a href="#">new</a></li>'
                + '<li><a href="#">todo</a></li>'
                + '<li><a href="#">memo</a></li>'
                + '<li><a href="#">del</a></li>'
                + '<li><a href="#">any</a></li>'
              + '</ul>'
            + '</div>'
            + '<div class="tomo-shell-main-search"><span>search</span></div>'
          + '</div>'
          + '<div class="tomo-shell-main-content">'
            + '<div class="tomo-shell-main-list">'
               + '<div id="tomo-list-frame"></div>'
            + '</div>'
          + '</div>'
 */
      main_html2 : String()
        + '</div>'
        + '<footer class="tomo-shell-foot">'
        + '<div id="cr"><span>&copy;2018 mediaLogo</span></div>'
        + '</footer> '
        + '<!-- <div class="tomo-shell-modal">modal</div>  -->',

    sub_html : String()
        + '<div class="tomo-shell-main-nav">'
          + '<div class="tomo-shell-main-command">'
            + '<ul>'
              + '<li><a href="#">new</a></li>'
              + '<li><a href="#">todo</a></li>'
              + '<li><a href="#">memo</a></li>'
              + '<li><a href="#">del</a></li>'
              + '<li><a href="#">any</a></li>'
            + '</ul>'
          + '</div>'
          + '<div class="tomo-shell-main-search"><span>search</span></div>'
        + '</div>'
        + '<div class="tomo-shell-main-content">'
          + '<div class="tomo-shell-main-list">'
              + '<div id="tomo-list-frame"></div>'
          + '</div>'
        + '</div>',

  },
  stateMap = {
    $container  : null,
  },
  jqueryMap = {},

initModule;
  //-------- モジュールスコープ変数終了 ------------

  //-------- ユーティリティメソッド開始 ------------
  // 格納したアンカーマップのコピーを返す。オーバーヘッドを最小限にする。

  //-------- ユーティリティメソッド終了 ------------

  //-------- DOMメソッド開始 ------------

  //DOMメソッド/setJqueryMap/開始 ------------
  setJqueryMap = function () {
    var $container = stateMap.$container;
    jqueryMap = {
        $container  : $container
    };
  };
  //DOMメソッド/setJqueryMap/終了 ------------

  //DOMメソッド/changeAnchorPart/開始 ------------
 
//-------- DOMメソッド終了 ------------

//-------- イベントハンドラ開始 ------------

  //-------- イベントハンドラ終了 ------------

  //-------- コールバックメソッド開始 ------------

  //-------- コールバックメソッド終了 ------------

  //-------- パブリックメソッド開始 ------------
  //パブリックメソッド/initModule/開始 ------------
  // 用例 : tomo.shell.initModule( $('#app_div_id') );
  // 目的 : ユーザーに機能を提供するようにチャットに指示する
  // 引数 :
  //  * $append_target (例: $('#app_div_id'))
  //  １つのDOMコンテナを表す jQueryコレクション
  // 動作 :
  //  $container にUIのシェルを含め、機能モジュールを構成して初期化する。
  //  シェルはURIあんかーや Cookieの管理などのブラウザ全体に及ぶ問題を担当する。
  // 戻り値 : なし
  // 例外発行 : なし
  //
  initModule = function ( $container, dest ) {
    // HTMLをロードし、jQueryコレクションをマッピングする
    stateMap.$container = $container;
    if ( dest === undefined ) {
      $container.html( configMap.main_html1 +configMap.main_html2  );
      setJqueryMap();
      tomo.login.initModule(jqueryMap.$container);
    } else if ( dest === 'list' ) {
      //$(configMap.main_html).find("#tomo-shell-main").append( configMap.sub_html );
      //console.log (configMap.main_html );
    //  $container.html( configMap.main_html );
      $container.html( configMap.main_html1 + configMap.sub_html + configMap.main_html2  );
      console.log($container.html());
      setJqueryMap();
      tomo.list.initModule(jqueryMap.$container);
    }
    //tomo.list.initModule( jqueryMap.$container);
  };
  //パブリックメソッド/initModule/終了 ------------
  return { initModule : initModule};
  //-------- パブリックメソッド終了 ------------
}());
