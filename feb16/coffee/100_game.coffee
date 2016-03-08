this.GameScene = cc.Scene.extend({
  targetFrame: 15/60
  realDeltaTime:0
  _positions:[]
  _stage:null
  _carRandomEngine:null
  ctor:()->
    @_super()
  onEnter:()->
    ## 960x640  20*13-> 48
    @_super()

    @clickHandler = new OneTwoClickScene();
    @addChild(@clickHandler)

    @tiledMap = cc.TMXTiledMap.create('res/stage.tmx');
    this.addChild(@tiledMap)

    @pingu = new Pingu(1,2, @tiledMap)
    @addChild(@pingu)

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

    @clickHandler.on('click',@pingu.onGoForward,@pingu)
    @clickHandler.on('dbclick',@pingu.onGoBackward,@pingu)

    return
  _moveFordward : () ->
    console.log('test')
    #@_stage.moveFordward()
  _moveBackward : () ->
    console.log('test')
    #@_stage.moveBackward()
})
