this.Pingu = cc.Node.extend({
  _initialRect: null
  _currentRect:null
  _sprite: null
  _limitTop: 12
  _limitBottom: 4
  _controlAuto:false
  ctor: (x,y,tiledMap)->
    @_super();
    @_initialPosition=cc.p(x,y)
    @_currentRect =cc.rect(
      x: x
      y: y
      width: tiledMap.getTileSize().width
      height: tiledMap.getTileSize().height
    )
    @_init()
    return
  # PRIVATE METHODS
  _updatePosition: ()->
    actionBy = new cc.JumpTo(.5,
      x: (@_currentRect.x * (@_currentRect.width/2))
      y: (@_currentRect.y * (@_currentRect.height) - @_currentRect.height/2 )
      , 20,2
    )
    @_sprite.runAction(actionBy)
    return
  _init:()->
    @_sprite = cc.Sprite.create("res/pingu.png")
    @_sprite.setPosition(
      x: @_currentRect.x * (@_currentRect.width /2)
      y: (@_currentRect.y * (@_currentRect.height) - @_currentRect.height/2 )
    )
    @addChild(@_sprite)
    return
  onGoForward: (_evt)->
    return if @_controlAuto
    if @_currentRect.y+1 > @_limitTop
      @_controlAuto=true
      return
    @_currentRect.y+=1
    @_updatePosition()
    return
  onGoBackward: (_evt)->
    return if @_controlAuto
    return if @_currentRect.y-1 < @_limitBottom
    @_currentRect.y-=1
    @_updatePosition()
    return
  # PUBLIC METHODS
  onEnter: () ->
    @_super();
  kill: ->
    cc.log('Killed')
    @_controlAuto=true
    @_sprite.setTexture('res/death.png')
    @scheduleOnce(
      ()->
        @removeFromParent()
      5
    )
    return

})