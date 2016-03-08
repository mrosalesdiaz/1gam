this.CarRandom = cc.Node.extend({
  _initialInterval: 1
  _interval: 2
  _roads:[]
  ctor: (positions) ->
    @_super()
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
  _spawn: (index)->
    cc.log("Put car in road "+index)
    road=@_roads[index]
    
    car = cc.Sprite.create("res/car.png")
    car.setPosition(
      x: road.x * (64 /2)
      y: (road.y * (64) + 64/2 )
    )
    @addChild(car)

  onEnter:()->
    @_super()
    @scheduleOnce(
      @_updateEngine
      @_initialInterval
    )
    return

})