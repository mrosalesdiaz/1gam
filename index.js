define(
    [
    "dojo/_base/declare"
    , "dojo/_base/lang"
    , "dojo/_base/array"
    , "dojo/query"
    , "dojo/on"
    , "dojo/Evented"
    , "dijit/_WidgetBase"
    , "dijit/_WidgetsInTemplateMixin"
    , "dijit/_AttachMixin"
    , "dijit/_TemplatedMixin"
    , "dojo/text!webapp/web-data.json"
    , "dojo/json"
    , "dojo/topic"
    // no param
    , "dojo/NodeList-dom"
    , "dojo/NodeList-html"
     ],
  function( declare, lang, array, query, on, Evented, _WidgetBase, _WidgetsInTemplateMixin, _AttachMixin, _TemplatedMixin, webData, json, topic ) {
    webData = json.parse( webData );
    /*
     * Page Controller Widget
     */
    declare( "PageController", [ _WidgetBase, _AttachMixin, _WidgetsInTemplateMixin, Evented ], {
      __gamegrid: null,
      buildRendering: function() {
        this.__gamegrid = query( "#__gamegrid" )[ 0 ];
        this._loadGames( webData );
        this.inherited( arguments );
      },
      _loadGames: function( gameList ) {
        query( "#__gamegrid" ).empty();
        array.forEach( gameList, lang.hitch( this, this._renderGameThumbnail ) )
      },
      _renderGameThumbnail: function( gameData ) {
        ( new GameThumbnail( gameData ) ).placeAt( "__gamegrid" );
      }
    } );
    /*
     * Widget Game Thumbnail
     */
    declare( "GameThumbnail", [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented ], {
      templatePath: "./templates/template_game.html",
      gameData: null,
      constructor: function( gameData ) {
        dojo.safeMixin( this, {
          gameData: gameData || {}
        } );
        this.inherited( arguments );
      },
      onPlay: function() {
        topic.publish( "topic/game/opened", lang.clone( this.gameData ) );
      }
    } );
    /*
     * Widget Modal Game
     */
    declare( "GameModal", [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented ], {
      templatePath: "./templates/template_game_modal.html",
      buildRendering: function() {
        this.inherited( arguments );
        topic.subscribe( "topic/game/opened", lang.hitch( this, this._openGameModal ) );
      },
      _openGameModal: function( data ) {
        this.__gameframe.src = data.folder + "/index.html";
        this.__name.innerText = data.name;
        $( "#__gamemodal" ).modal( 'show' );
      }
    } );
  } );
