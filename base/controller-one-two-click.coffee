# One and two touch event handler. This clase provides simple access to create an event handler to detect one click and double click in the sccene it is added.
# @usage
#          var clickHandler = new OneTwoClickScene( );
#          clickHandler.on( 'oneclick', this.onClickOne, this );
#          clickHandler.on( 'twoclick', this.onClickDouble, this );
#          this.addChild( clickHandler ); // must be added to scene
# @autor Maximo Rosales
@OneTwoClickScene = cc.Node.extend(
  _clickListener: null
  _interval: 0.2
  _clickCounter: 0
  _gameTimeInterval: 0
  _lastTouch: 0
  state: null
  _fnToExecute: null
  ctor: ->
    @_super()
    @state = OneTwoClickScene.ACTION_NONE
    # binding all function in fn
    @fn.onTouchBegan = @fn.onTouchBegan.bind(this)
    @fn.onTouchMoved = @fn.onTouchMoved.bind(this)
    @fn.onTouchEnded = @fn.onTouchEnded.bind(this)
    @_clickListener = cc.EventListener.create(@fn)
    return
  fn:
    event: cc.EventListener.TOUCH_ONE_BY_ONE
    swallowTouches: true
    onTouchBegan: (touch, event) ->
      @state = OneTwoClickScene.ACTION_CLICK_DOWN
      true
    onTouchMoved: (touch, _event) ->
    onTouchEnded: (touch, _event) ->
      @_clickCounter++
      if @_clickCounter == 1
        @scheduleOnce @_makeOneClick.bind(this, touch, _event), @_interval, '___hello'
      else if @_clickCounter == 2
        @unschedule '___hello'
        @_clickCounter = 0
        @_on_dbclick touch, _event
      return
  _makeOneClick: (touch, _event) ->
    @_clickCounter = 0
    @_on_click touch, _event
    return
  on: (eventName, fn, context) ->
    if @['_on_' + eventName]
      if context
        @['_on_' + eventName] = fn.bind(context)
      else
        @['_on_' + eventName] = fn
    return
  _on_click: (touch, _event) ->
    cc.error 'no event registered use: clickHandler.on( \'click\', this.onClick, this )'
    return
  _on_dbclick: (touch, _event) ->
    cc.error 'no event registered use: clickHandler.on( \'dbclick\', this.onClick, this )'
    return
  onEnter: ->
    @_super()
    cc.eventManager.addListener @_clickListener, @parent
    @scheduleUpdate()
    return
  update: (delta) ->
    @_gameTimeInterval += delta
    return
)
# Constants
i = 0
@OneTwoClickScene.ACTION_NONE = ++i
@OneTwoClickScene.ACTION_CLICK_DOWN = ++i