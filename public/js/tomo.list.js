/*
 * tomo.list.js
 * tomoのリスト機能モジュール
*/

/*jslint  browser : true, continue : true,
  devel : true, indent :2, maxerr : 50,
  newcap: true, nomen :true, plusplus : true,
  regexp : true, sloppy : true, vars : false,
  white  : true
*/

/*global $, tomo */

tomo.list = (function () {
  'use strict';
//---------------- モジュールスコープ変数↓ --------------
var
  configMap = {
    main_html : String()
      + '<div class="tomo-list">'
        + '<div class="tomo-list-head">'
          + '<div class="tomo-list-head-title">'
            + '<button id="new-item">新規</button>'
            + '<button id="del-item">削除</button>'
          + '</div>'
        + '</div>'
        + '<div class="tomo-list-box">'
            + '<ul class="tomo-list-items" ></ul>'
        + '</div>' 
      + '</div>'

  },  
  
  stateMap = { $append_target : null},
  jqueryMap = {},

  last_selected_item = -1,

  setJqueryMap,
  onClickNew, onClickItem, onClickDelete,
  configModule, initModule;

//----------------- モジュールスコープ変数↑ ---------------

//------------------- ユーティリティメソッド↓ ------------------
// getEmSize() 削除
//-------------------- ユーティリティメソッド↑ -------------------

//--------------------- DOMメソッド↓ --------------------
// DOM メソッド /setJqueryMap/↓
setJqueryMap = function () {
  var
    $append_target = stateMap.$append_target,
    $list = $append_target.find( '.tomo-list'),
    $list_head = $append_target.find( '.tomo-list-head'),
    $list_box = $append_target.find( '.tomo-list-box'),
    $list_items = $append_target.find( '.tomo-list-items'),
    $list_item = $append_target.find( '.tomo-list-item'),
    $add_new = $append_target.find( '#new-item'),
    $delete_item = $append_target.find( '#del-item')

  jqueryMap = {
    $list : $list,
    $list_head : $list_head,
    $list_box : $list_box,
    $list_items : $list_items,
    $list_item : $list_item,
    $add_new : $add_new,
    $delete_item : $delete_item,
    $window		: $(window)
  };
};
// DOM メソッド /setJqueryMap/ ↑



//------------------- パブリックメソッド↓ -------------------
// パブリックメソッド /configModule/↓
// 用例 : tomo.list.configModule({ slider_open_em : 18 })
// 目的 : 初期化前にモジュールを構成する
// 引数 :
//   * set_list_anchor - オープンまたはクローズ状態を示すように
//     URIアンカーを変更するコールバック。このコールバックは要求された状態を
//     満たせない場合にはfalseを返さなければならない
//   * list_model - インスタントメッセージングと
//     やり取りするメソッドを提供するチャットモデルオブジェクト。
//   * people_model - モデルが保持する人々の
//     リストを管理するメソッドを提供するピープルモデルオブジェクト。
//   * slider_*構成 - すべてオプションのスカラー。
//     完全なリストは mapConfig.settable_map を参照。
//     用例 : slider_open_em はオープン時の高さ(em単位)。
// 動作
//   指定された引数で内部構成データ構造(configMap)を更新する。
//   その他の動作は行わない。
// 戻り値   : true
// 例外発行  : 受け入れられない引数や、欠如した引数の場合
//          JavaScriptエラーオブジェクトとスタックトレースを投げる

configModule = function ( input_map ) {
  tomo.util.setConfigMap({
    input_map    : input_map,
    config_map   : configMap
  });
  return true;
};

// イベントハンドラ開始
var pos_start = 0, pos = 0 ,place=0, place_prev=0;
var startedTime =0, collapsedTime =0;
var draggedItem;

onClickNew = function( event ) {
      var $item_list = jqueryMap.$list_items,
      item_count = $item_list.children().length;

      item_count++;

      var $item =$('<li class="tomo-list-item">todo ' +  item_count + '</li>')
      .draggable({
        distance:15, 
        opacity: 0.6, 
        //revert: true, 
        //revertDuration:350, 
        zIndex:1000,
        helper: "clone",
        
        start : function(event,ui) {
          pos_start = ui.offset.top;
          draggedItem = event.target;
        },

        drag : function(event,ui){
          pos = ui.offset.top;
          place = parseInt((pos - pos_start) / item_height);
          if (place != place_prev ){
            // console.log("pos=" + (pos - pos_start), " (" + place +")");
            place_prev = place;
          }
        },

        stop : function() {
        }

      }).droppable({
      accept:'li.tomo-list-item', 
      // hoverClass:'hover',
      tolerance :'touch',  

      over : function( event, ui) {
        // startedTime = Date.now();
        $(this).addClass( "ui-state-highlight" );
      },

      out : function( event, ui) {
        $(this).removeClass( "ui-state-highlight" );
      },
      
      drop: function( event, ui ) {
        //collapsedTime = Date.now() - startedTime;
        var $childItems = $item_list.children(':not([style])'); 
        var idx = $childItems.index($(event.target));
        console.log("dropped on " + idx + " of " + $childItems.length + " items");

        if (place < 0 ) {
          $item_list[0].insertBefore(draggedItem, event.target);

        }else if (place > 0 ){
          if (idx === $childItems.length) {
            $item_list.appendChild(draggedItem);
          } else {
            $item_list[0].insertBefore(draggedItem, event.target);
          }
        }

      },
      deactivate: function( event, ui){
        $('.ui-state-highlight').removeClass( "ui-state-highlight" );
      }


  }).selectable();

  $item_list.append($item);
  var item_height = $item.height();

}

onClickDelete = function( event ) {
  var $selected_items = jqueryMap.$list_items.find($("li.ui-selected"));
  if ($selected_items != undefined) {
    $selected_items.remove();
  }
}

// イベントハンドラ終了

// パブリックメソッド /configModule/ ↑

// パブリックメソッド /initModule/ ↓
// 用例 : tomo.list.initModule ( $('#div_id') );
// 目的    : ユーザーに機能を提供するようにチャットに指示する
// 引数  :
//  * $append_target (例: $('#div_id') );
//  1つのDOMコンテナを表すjQueryコレクション
// 動作 :
//  指定されたコンテナにチャットスライダーを付加し、HTMLコンテンツで埋める
//  そして、要素、イベント、ハンドラを初期化し、ユーザーにチャットルームインターフェイスを提供する。
// 戻り値    : 成功時 true, 失敗時 false
// 例外発行     : なし
//
initModule = function ( $append_target ) {
  $append_target.find("#tomo-list-frame").append( configMap.main_html );
  //$append_target.html( configMap.main_html );
  stateMap.$append_target = $append_target;
  setJqueryMap();

  for (var i=0; i<10; i++) {
    onClickNew();
  }

  
  // チャットスライダーをデフォルトのタイトルと状態で初期化する
  // jqueryMap.$toggle.prop( 'title', configMap.slider_closed_title );
  // stateMap.position_type = 'closed';

  // $list_box でjQueryグローバルイベントに登録する
/*     $list_box = jqueryMap.$list_box;
  $.gevent.subscribe( $list_box, 'tomo-listchange', onListchange );
  $.gevent.subscribe( $list_box, 'tomo-setlistee', onSetlistee );
  $.gevent.subscribe( $list_box, 'tomo-updatelist', onUpdatelist );
  $.gevent.subscribe( $list_box, 'tomo-login', onLogin );
  $.gevent.subscribe( $list_box, 'tomo-logout', onLogout );
*/
  // ユーザー入力イベントをバインドする
  jqueryMap.$add_new.bind('utap', onClickNew );
  jqueryMap.$delete_item.bind('utap', onClickDelete );
 // jqueryMap.$list_items.bind( 'utap', onClickItem );
//    jqueryMap.$send.bind( 		'utap', onSubmitMsg );
//    jqueryMap.$form.bind( 	'submit', onSubmitMsg );

//    return true;
};
// パブリックメソッド /initModule/ ↑

// パブリックメソッドを返す
return {
  configModule : configModule,
  initModule   : initModule,
};

//------------------- パブリックメソッド↑ ---------------------
}());
