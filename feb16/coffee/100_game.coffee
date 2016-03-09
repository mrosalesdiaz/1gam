i=2000
TAG_PINGU=++i
this.GameScene = cc.Scene.extend({
  targetFrame: 15/60
  realDeltaTime:0
  _positions:[]
  _stage:null
  _carRandomEngine:null
  _isStarted:false
  _finishLine:null
  _startOverlay:null
  ctor:()->
    @_super()
    @_finishLine=cc.rect({
      x:0
      y:12
      width:10
      height:3
      })
    
  onEnter:()->
    ## 960x640  20*13-> 48
    @_super()

    @clickHandler = new OneTwoClickScene();
    @addChild(@clickHandler)

    @tiledMap = cc.TMXTiledMap.create('res/stage.tmx');
    this.addChild(@tiledMap)

    

    @_carRandomEngine=new CarRandom([
        x:-1 
        y:3
        d:1
      ,
        x:11
        y:4
        d:-1
      ,
        x:-1 
        y:6
        d:1
      ,
        x:11
        y:7
        d:-1
      ,
        x:-1 
        y:9
        d:1
      ,
        x:11
        y:10
        d:-1
    ]
    @tiledMap);
    @addChild(@_carRandomEngine);

    @clickHandler.on('click',@_onOneClick,@)
    @clickHandler.on('dbclick',@_onDoubleClick,@)
    @schedule(@_testCollision)


    @_startOverlay=cc.LayerColor.create(new cc.Color(200,100,100,100))
    startText=cc.LabelTTF.create("Start")
    startText.setAnchorPoint(.5, .5)

    winSize = cc.director.getWinSize()

    startText.setPosition(winSize.width/2, winSize.height/2)
    startText.setFontSize(80)
    @_startOverlay.addChild(startText)
    @addChild(@_startOverlay)
    return
  startGame: ->
    cc.log('===========')
    cc.log('Start Game')
    cc.log('===========')
    @_addPingus(cc.p(2,2))
  _onOneClick: ->
    cc.log('oneClick')
    if @_isStarted
      pingu.onGoForward.bind(pingu)() for pingu in this.getChildren() when pingu.getTag() is TAG_PINGU by -1
    else
      @_startOverlay.setVisible(false)
      @_isStarted=true
      @startGame()
    return 
  _onDoubleClick:->
    pingu.onGoBackward.bind(pingu)() for pingu in this.getChildren() when pingu.getTag() is TAG_PINGU by -1
    return
  _addPingus:(p)->
    pingu = new Pingu(p.x,p.y, @tiledMap)
    pingu.setTag(TAG_PINGU)
    @addChild(pingu)
  _testCollision:->
    @_isCarHit(pingu) for pingu in this.getChildren() when pingu.getTag() is TAG_PINGU by -1
    return
  _isCarHit:(pingu)->
    if @_carRandomEngine.test(pingu._sprite.getBoundingBox())
      if !pingu._controlAuto
        pingu.kill()
})
