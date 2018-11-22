/*
 * tomo.model.js
 * モデル機能モジュール
 *
 * Michael S. Mikowski - mike.mikowski@gmail.com
 * Copyright (c) 2011-2012 Manning Publications Co.
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global TAFFY, $, tomo */

tomo.model = (function () {

  'use strict';
  //---------------- モジュールスコープ変数↓ --------------
  var
    configMap = { anon_id : 'a0'},
    stateMap  = {
      anon_user	: null,   // 匿名personオブジェクトを格納
      cid_serial: 0,
      people_cid_map : {},// クライアントIDをキーとしたpersonオブジェクトのマップ
      people_db		 : TAFFY(), //personオブジェクトのTaffyDBコレクションを格納
      user			: null,
      is_connected : false, // ユーザーが現在チャットルームにいるかどうか
    },

    isFakeData = true, // true,

    personProto, makeCid, clearPeopleDb, completeLogin,
    makePerson, removePerson, people, 
    //chat, 
    initModule;
  //----------------- モジュールスコープ変数↑ ---------------

  // peopleオブジェクトAPI
  // ---------------------

  personProto = {
      get_is_user : function () { // オブジェクトが現在のユーザの場合にtrueを返す
          return this.cid === stateMap.user.cid;
      },
      get_is_anon : function () { // オブジェクトが匿名ユーザの場合にtrueを返す
          return this.cid === stateMap.anon_user.cid;
      }
  };

  makeCid = function (){
      return 'c' + String( stateMap.cid_serial++ );
  };

  clearPeopleDb = function (){
      var user = stateMap.user;
      stateMap.people_db = TAFFY();
      stateMap.people_cid_map = {};
      if ( user ) {
          stateMap.people_db.insert( user );
          stateMap.people_cid_map[ user.cid ] = user;
      }
  };

  completeLogin = function ( user_list ) {
      var user_map = user_list[0];
      delete stateMap.people_cid_map[ user_map.cid ];
      stateMap.user.cid = user_map._id;
      stateMap.user.id = user_map._id;
      stateMap.user.css_map = user_map.css_map;
      stateMap.people_cid_map[ user_map._id ] = stateMap.user;

      // チャットに参加
      //chat.join();
      $.gevent.publish( 'tomo-login', [ stateMap.user ]);
  };


  makePerson = function ( person_map ) {
    var person,
          cid			= person_map.cid,
          id 			= person_map.id,
          passwd    = person_map.passwd,
          name		= person_map.name;

    if ( !passwd || !name ) {
        throw 'ユーザー名とパスワードが必要です';
    }

    // personオブジェクトを作成
    person			= Object.create( personProto );
    person.cid	= cid;
    person.name = name;
    person.passwd = passwd;

    if ( id ) { person.id = id; }

    stateMap.people_cid_map[ cid ] = person;
    stateMap.people_db.insert( person );

    return person;
  };

  removePerson = function ( person ){
      if ( ! person ){ return false; }
      // 匿名ユーザは削除できない
      if ( person.id === configMap.anon_id ){
          return false;
      }

      stateMap.people_db({ cid : person.cid }).remove();
      if ( person.cid ){
          delete stateMap.people_cid_map[ person.cid ];
      }
      return true;
  };

  //------------------- パブリックメソッド↓ -------------------
  // パブリックメソッド /people/ ↓
  people = (function (){
    var get_by_cid, get_db, get_user, login, logout,
        people_list;

    get_by_cid = function ( cid ){
        return stateMap.people_cid_map[ cid ];
    };

    get_db = function () { return stateMap.people_db; };

    get_user = function () { return stateMap.user; };

    login = function ( name, passwd  ) {
      var sio = isFakeData ? tomo.fake.mockSio : tomo.data.getSio(),
          userFound = null; 



      userFound = stateMap.people_db({name:name, passwd:passwd}).first();

      if ( userFound ){
        stateMap.user = userFound;
        stateMap.user.passwd = "";
        console.log(stateMap.user);
            return true;
      } else {
          return false;
      } 
    

    //   sio.on( 'userupdate', completeLogin );  

    //   sio.emit( 'adduser', {
    //       cid 	 : stateMap.user.cid,
    //       name	 : stateMap.user.name
    //   });
      return true;
    };

    logout = function () {
      var user = stateMap.user;

      //チャットルームから退出
      chat._leave();
      stateMap.user = stateMap.anon_user;
      clearPeopleDb();

      $.gevent.publish( 'tomo-logout', [ user ]);
    };

    return {
      get_by_cid	: get_by_cid,
      get_db			: get_db,
      get_user		: get_user,
      login				: login,
      logout			: logout
    };
  }());
  // パブリックメソッド /people/ ↑


  // パブリックメソッド /initModule/ ↓
  // 目的     : モジュールを初期化する
  // 引数     : なし
  // 戻り値   : なし
  // 例外発行 : なし
  //
  initModule = function () {
    var i, people_list, person_map;

    // 匿名ユーザを初期化する
    stateMap.anon_user = makePerson({
      cid : configMap.anon_id,
      id  : configMap.anon_id,
      passwd : 'secret',
      name: 'anonymous'
    });
    stateMap.user = stateMap.anon_user; // 現在のユーザの初期値は匿名ユーザ

    if ( isFakeData ) {
        people_list = tomo.fake.getPeopleList();
        for ( i = 0; i < people_list.length; i++) {
            person_map = people_list[i];
            makePerson({
              cid     : person_map._id,
              id     : person_map._id,
              name     : person_map.name,
              passwd     : person_map.passwd
            });
        }
    }
    

  };
  // パブリックメソッド /initModule/ ↑

  // パブリックメソッドを返す
  return {
    initModule  : initModule,
//    chat				: chat,
    people			: people,
    hello   : "hello!"
  };
  //------------------- パブリックメソッド↑ ---------------------
}());
