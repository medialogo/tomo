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
  addNewItem,
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

addNewItem = function( idx, item ) {


      var $item;
      
      if ( item === undefined ) {
        $item =$('<li class="tomo-list-item"><span class="ui-icon ui-icon-triangle-2-n-s"></span> todo '
        + idx 
        + '</span></li>');
      } else {
        $item =$('<li class="tomo-list-item"><span class="ui-icon ui-icon-triangle-2-n-s"></span> todo '
        + item.linum  + ' ' + item.title 
        + '</span></li>');
      }

    //  $item.bind( 'utap', onClickItem );
      $item.on("mousedown", function( event ) {
        var $list = jqueryMap.$list_items;

        if (event.clientX < 50 ) {
          $list.selectable('disable');
          $list.children().removeClass('ui-selected');
          $list.sortable('enable');
          $list.sortable({
            tolerance : "pointer",
            stop: function(event, ui) {
              ui.item.addClass('ui-selected');
            }
          });

        } else {
          $list.sortable('disable');
          $list.selectable('enable');

        }
      });

      jqueryMap.$list_items.append($item);
      var item_height = $item.height();

}

onClickNew = function( event ) {
  var $item_list = jqueryMap.$list_items,
  item_count = $item_list.children().length;

  addNewItem(++item_count);

}

onClickDelete = function( event ) {
  var $selected_items = jqueryMap.$list_items.find($("li.ui-selected"));
  if ($selected_items != undefined) {
    $selected_items.remove();
  }
}

onClickItem = function ( event ) {
  console.log ( event.target);
}

// イベントハンドラ終了

// パブリックメソッド /configModule/ ↑

// パブリックメソッド /initModule/ ↓
//
initModule = function ( $append_target ) {
  var get_db, todo_list = {}, item, idx;
  stateMap.$append_target = $append_target;
  $append_target.find("#tomo-list-frame").append( configMap.main_html );
  setJqueryMap();


  jqueryMap.$list_items.sortable().selectable();

  var current_user = tomo.model.users.get_current_user(); 
  
  var todo_db = tomo.model.todo.get_db();
  var list = todo_db().get();

  todo_db().each( function (item, idx) {
    todo_list[idx] = {
      id     : item._id,
      cid    : item.cid,
      uid    : item.uid,
      linum  : item.linum,
      order  : item.order,
      title  : item.title,
      memo   : item.memo
    }
    addNewItem(idx, item);
  });


/*    for (var i=0; i<10; i++) {
    onClickNew();
  } 
 */
  
  // $list_box でjQueryグローバルイベントに登録する
/*     $list_box = jqueryMap.$list_box;
  $.gevent.subscribe( $list_box, 'tomo-listchange', onListchange );
  $.gevent.subscribe( $list_box, 'tomo-setlistee', onSetlistee );
*/
  // ユーザー入力イベントをバインドする
  jqueryMap.$add_new.bind('utap', onClickNew );
  jqueryMap.$delete_item.bind('utap', onClickDelete );
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
