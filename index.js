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
    , "dojo/text!web-data.json"
    , "dojo/json"
    // no param
    , "dojo/NodeList-dom"
    , "dojo/NodeList-html"
     ],
  function( declare, lang, array, query, on, Evented, _WidgetBase, _WidgetsInTemplateMixin, _AttachMixin, _TemplatedMixin, webData, json ) {
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
      constructor: function( gameData ) {
        dojo.safeMixin( this, gameData )
        this.inherited( arguments );
      }
    } );
    /*
     * Widget Modal Game
     */
    declare( "GameModal", [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented ], {
      templatePath: "./templates/template_game_modal.html",
    } );
  } );