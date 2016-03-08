i=2000
TAG_CAR_LEFT=++i
TAG_CAR_RIGHT=++i

_CHECK_HIT = 1/60

this.CarRandom = cc.Node.extend({
  _elapsedTime:0
  _initialInterval: 1
  _interval: 2
  _roads:[]
  _leftLimit:null
  _rightLimit:null
  _tileSize:null,
  _tileSizeHalf:null,
  _mapSize:null
  ctor: (positions, tiledMap) ->
    @_super()
    
    @_tileSize = cc.size(tiledMap.getTileSize())
    @_mapSize = cc.size(tiledMap.getMapSize()) 
    @_tileSizeHalf = cc.size(@_tileSize.width/2, @_tileSize.height/2)

    @_leftLimit= cc.rect({
      x: -@_tileSize.width
      y: 0
      width: @_tileSize.width
      height: @_tileSize.height * @_mapSize.height
    })

    @_rightLimit= cc.rect({
      x: @_tileSize.width * @_mapSize.width
      y: 0
      width: @_tileSize.width
      height: @_tileSize.height * @_mapSize.height
    })

    @setAnchorPoint(0,0)

    @_roads = for child in positions
      child.__i = @_calculateRandom(3,7)
      x  : child.x
      y  : child.y
      d  : child.d
      v  : @_calculateRandom(10,100)
      i  : @_calculateRandom(5,10)
      _i : child.__i
      ii : child.__i
    return
  _joinPosAndSize:(p, s)->
    cc.rect(
      x:p.x
      y:p.y
      width:s.width
      height:s.height
    )
  _calculateRandom: (max,min) ->
    parseInt((max - min + 1)*cc.random0To1() + min)
  _updateEngine: () ->
    @_step i, road for road, i in @_roads
    cc.log("=== ITERATION "+(Date.now()))
    #cc.log(JSON.stringify(@_roads))
    @scheduleOnce(
      @_updateEngine.bind(this)
      @_interval
    )
    return
  _step: (index, road)->
    road._i = if road._i < 1  then road.i else road._i-1;
    @_spawn(index) if road._i == 0

    # Remove 
    @removeChild item for item in this.getChildren() when item.getTag() is TAG_CAR_LEFT and  cc.rectIntersectsRect(@_rightLimit, item.getBoundingBox()) by -1
    @removeChild item for item in this.getChildren() when item.getTag() is TAG_CAR_RIGHT and  cc.rectIntersectsRect(@_leftLimit, item.getBoundingBox()) by -1
    return
  _spawn: (index)->
    cc.log("Put car in road "+index)
    road=@_roads[index]
    
    car = cc.Sprite.create("res/car.png")
    car.setPosition(
      x: road.x * @_tileSize.width + @_tileSizeHalf.width
      y: road.y * @_tileSize.height + @_tileSizeHalf.height
    )
  
    @addChild(car)
    tempRect=@_joinPosAndSize(car.getPosition(),@_tileSize)
    if road.d>0
      car.setTag(TAG_CAR_LEFT)
      car.runAction(@_runRight(tempRect))
    else
      car.setTag(TAG_CAR_RIGHT)
      car.runAction(@_runLeft(tempRect))      
    return
  onEnter:()->
    @_super()
    @scheduleOnce(
      @_updateEngine
      @_initialInterval
    )
    @schedule(
      @_checkHit
      _CHECK_HIT
    )
    return
  _checkHit:()->
    
  _runLeft:(_currentRect)->
    new cc.MoveTo(1,
      x: -_currentRect.width
      y: _currentRect.y
    )
  _runRight:(_currentRect)->
    new cc.MoveTo(1,
      x: _currentRect.width*11
      y: _currentRect.y
    )
  _death:(pingu)->
    cc.log("Death")

})