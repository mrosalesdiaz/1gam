(function() {
  var i;

  this.OneTwoClickScene = cc.Node.extend({
    _clickListener: null,
    _interval: 0.2,
    _clickCounter: 0,
    _gameTimeInterval: 0,
    _lastTouch: 0,
    state: null,
    _fnToExecute: null,
    ctor: function() {
      this._super();
      this.state = OneTwoClickScene.ACTION_NONE;
      this.fn.onTouchBegan = this.fn.onTouchBegan.bind(this);
      this.fn.onTouchMoved = this.fn.onTouchMoved.bind(this);
      this.fn.onTouchEnded = this.fn.onTouchEnded.bind(this);
      this._clickListener = cc.EventListener.create(this.fn);
    },
    fn: {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: function(touch, event) {
        this.state = OneTwoClickScene.ACTION_CLICK_DOWN;
        return true;
      },
      onTouchMoved: function(touch, _event) {},
      onTouchEnded: function(touch, _event) {
        this._clickCounter++;
        if (this._clickCounter === 1) {
          this.scheduleOnce(this._makeOneClick.bind(this, touch, _event), this._interval, '___hello');
        } else if (this._clickCounter === 2) {
          this.unschedule('___hello');
          this._clickCounter = 0;
          this._on_dbclick(touch, _event);
        }
      }
    },
    _makeOneClick: function(touch, _event) {
      this._clickCounter = 0;
      this._on_click(touch, _event);
    },
    on: function(eventName, fn, context) {
      if (this['_on_' + eventName]) {
        if (context) {
          this['_on_' + eventName] = fn.bind(context);
        } else {
          this['_on_' + eventName] = fn;
        }
      }
    },
    _on_click: function(touch, _event) {
      cc.error('no event registered use: clickHandler.on( \'click\', this.onClick, this )');
    },
    _on_dbclick: function(touch, _event) {
      cc.error('no event registered use: clickHandler.on( \'dbclick\', this.onClick, this )');
    },
    onEnter: function() {
      this._super();
      cc.eventManager.addListener(this._clickListener, this.parent);
      this.scheduleUpdate();
    },
    update: function(delta) {
      this._gameTimeInterval += delta;
    }
  });

  i = 0;

  this.OneTwoClickScene.ACTION_NONE = ++i;

  this.OneTwoClickScene.ACTION_CLICK_DOWN = ++i;

}).call(this);

(function() {
  this.Pingu = cc.Node.extend({
    _initialRect: null,
    _currentRect: null,
    _sprite: null,
    _limitTop: 12,
    _limitBottom: 2,
    ctor: function(x, y, tiledMap) {
      this._super();
      this._initialPosition = cc.p(x, y);
      this._currentRect = cc.rect({
        x: x,
        y: y,
        width: tiledMap.getTileSize().width,
        height: tiledMap.getTileSize().height
      });
      this._init();
    },
    _updatePosition: function() {
      var actionBy;
      actionBy = new cc.JumpTo(.5, {
        x: this._currentRect.x * (this._currentRect.width / 2),
        y: this._currentRect.y * this._currentRect.height - this._currentRect.height / 2
      }, 20, 2);
      this._sprite.runAction(actionBy);
    },
    _init: function() {
      this._sprite = cc.Sprite.create("res/pingu.png");
      this._sprite.setPosition({
        x: this._currentRect.x * (this._currentRect.width / 2),
        y: this._currentRect.y * this._currentRect.height - this._currentRect.height / 2
      });
      this.addChild(this._sprite);
    },
    onGoForward: function(_evt) {
      if (this._currentRect.y + 1 > this._limitTop) {
        return;
      }
      this._currentRect.y += 1;
      this._updatePosition();
    },
    onGoBackward: function(_evt) {
      if (this._currentRect.y - 1 < this._limitBottom) {
        return;
      }
      this._currentRect.y -= 1;
      this._updatePosition();
    },
    onEnter: function() {
      return this._super();
    }
  });

}).call(this);

(function() {
  this.CarRandom = cc.Node.extend({
    _initialInterval: 1,
    _interval: 2,
    _roads: [],
    ctor: function(positions) {
      var child;
      this._super();
      this._roads = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = positions.length; j < len; j++) {
          child = positions[j];
          child.__i = this._calculateRandom(3, 7);
          results.push({
            x: child.x,
            y: child.y,
            d: child.d,
            v: this._calculateRandom(10, 100),
            i: this._calculateRandom(5, 10),
            _i: child.__i,
            ii: child.__i
          });
        }
        return results;
      }).call(this);
    },
    _calculateRandom: function(max, min) {
      return parseInt((max - min + 1) * cc.random0To1() + min);
    },
    _updateEngine: function() {
      var i, j, len, ref, road;
      ref = this._roads;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        road = ref[i];
        this._step(i, road);
      }
      cc.log("=== ITERATION " + (Date.now()));
      this.scheduleOnce(this._updateEngine.bind(this), this._interval);
    },
    _step: function(index, road) {
      road._i = road._i < 1 ? road.i : road._i - 1;
      if (road._i === 0) {
        return this._spawn(index);
      }
    },
    _spawn: function(index) {
      var car, road;
      cc.log("Put car in road " + index);
      road = this._roads[index];
      car = cc.Sprite.create("res/car.png");
      car.setPosition({
        x: road.x * (64 / 2),
        y: road.y * 64. + 64 / 2
      });
      return this.addChild(car);
    },
    onEnter: function() {
      this._super();
      this.scheduleOnce(this._updateEngine, this._initialInterval);
    }
  });

}).call(this);

(function() {
  this.GameScene = cc.Scene.extend({
    targetFrame: 15 / 60,
    realDeltaTime: 0,
    _positions: [],
    _stage: null,
    _carRandomEngine: null,
    ctor: function() {
      return this._super();
    },
    onEnter: function() {
      this._super();
      this.clickHandler = new OneTwoClickScene();
      this.addChild(this.clickHandler);
      this.tiledMap = cc.TMXTiledMap.create('res/stage.tmx');
      this.addChild(this.tiledMap);
      this.pingu = new Pingu(1, 2, this.tiledMap);
      this.addChild(this.pingu);
      this._carRandomEngine = new CarRandom([
        {
          x: 2,
          y: 3,
          d: 1
        }, {
          x: 11,
          y: 4,
          d: 2
        }, {
          x: 2,
          y: 6,
          d: 1
        }, {
          x: 11,
          y: 7,
          d: 2
        }, {
          x: 2,
          y: 9,
          d: 1
        }, {
          x: 11,
          y: 10,
          d: 2
        }
      ]);
      this.addChild(this._carRandomEngine);
      this.clickHandler.on('click', this.pingu.onGoForward, this.pingu);
      this.clickHandler.on('dbclick', this.pingu.onGoBackward, this.pingu);
    },
    _moveFordward: function() {
      return console.log('test');
    },
    _moveBackward: function() {
      return console.log('test');
    }
  });

}).call(this);
