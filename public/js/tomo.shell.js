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
      main_html : String()
        + '<header>'
          + '<div class="tomo-shell-head" >'
            + '<div class="tomo-shell-head-logo"><span>Todo meMo</span></div>'
          + '</div>'
         + '</header>'
        + '<div class="tomo-shell-main" >'
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
            + '<div class="tomo-shell-main-content-list"><img src="file:///C:\\Users/takashi/Desktop/astro/20180117/DSC_0418_s.png" alt="astro">'
              + '<div>list</div>'
              + '<h1>見出し１</h1><p>あいうえお</p>'
              + '<h2>見出し2</h2><p>あいうえお</p>'
              + '<h3>見出し3</h3><p>あいうえお</p>'
              + '<h4>見出し4</h4><p>あいうえお</p>'
              + '<h5>見出し5</h5><p>あいうえお</p>'
              + '<h6>見出し6</h6><p>あいうえお</p>'
            + '</div>'
          + '</div>'
        + '</div>'
        + '<footer class="tomo-shell-foot">'
          + '<div id="cr"><span>&copy;2018 mediaLogo</span></div>'
        + '</footer> '
        + '<!-- <div class="tomo-shell-modal">modal</div>  -->'
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
  initModule = function ( $container ) {
    // HTMLをロードし、jQueryコレクションをマッピングする
    stateMap.$container = $container;
    $container.html( configMap.main_html );
    setJqueryMap();
  };
  //パブリックメソッド/initModule/終了 ------------
  return { initModule : initModule};
  //-------- パブリックメソッド終了 ------------
}());
