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
    _limitBottom: 4,
    _controlAuto: false,
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
      if (this._controlAuto) {
        return;
      }
      if (this._currentRect.y + 1 > this._limitTop) {
        this._controlAuto = true;
        return;
      }
      this._currentRect.y += 1;
      this._updatePosition();
    },
    onGoBackward: function(_evt) {
      if (this._controlAuto) {
        return;
      }
      if (this._currentRect.y - 1 < this._limitBottom) {
        return;
      }
      this._currentRect.y -= 1;
      this._updatePosition();
    },
    onEnter: function() {
      return this._super();
    },
    kill: function() {
      cc.log('Killed');
      this._controlAuto = true;
      this._sprite.setTexture('res/car.png');
      this.scheduleOnce(function() {
        return this.removeFromParent();
      }, 5);
    }
  });

}).call(this);

(function() {
  var TAG_CAR_LEFT, TAG_CAR_RIGHT, _CHECK_HIT, i;

  i = 2000;

  TAG_CAR_LEFT = ++i;

  TAG_CAR_RIGHT = ++i;

  _CHECK_HIT = 1 / 60;

  this.CarRandom = cc.Node.extend({
    _elapsedTime: 0,
    _initialInterval: 1,
    _interval: 2,
    _roads: [],
    _leftLimit: null,
    _rightLimit: null,
    _tileSize: null,
    _tileSizeHalf: null,
    _mapSize: null,
    ctor: function(positions, tiledMap) {
      var child;
      this._super();
      this._tileSize = cc.size(tiledMap.getTileSize());
      this._mapSize = cc.size(tiledMap.getMapSize());
      this._tileSizeHalf = cc.size(this._tileSize.width / 2, this._tileSize.height / 2);
      this._leftLimit = cc.rect({
        x: -this._tileSize.width,
        y: 0,
        width: this._tileSize.width,
        height: this._tileSize.height * this._mapSize.height
      });
      this._rightLimit = cc.rect({
        x: this._tileSize.width * this._mapSize.width,
        y: 0,
        width: this._tileSize.width,
        height: this._tileSize.height * this._mapSize.height
      });
      this.setAnchorPoint(0, 0);
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
    _joinPosAndSize: function(p, s) {
      return cc.rect({
        x: p.x,
        y: p.y,
        width: s.width,
        height: s.height
      });
    },
    _calculateRandom: function(max, min) {
      return parseInt((max - min + 1) * cc.random0To1() + min);
    },
    _updateEngine: function() {
      var j, len, ref, road;
      ref = this._roads;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        road = ref[i];
        this._step(i, road);
      }
      cc.log("=== ITERATION " + (Date.now()));
      this.scheduleOnce(this._updateEngine.bind(this), this._interval);
    },
    _step: function(index, road) {
      var item, j, k, ref, ref1;
      road._i = road._i < 1 ? road.i : road._i - 1;
      if (road._i === 0) {
        this._spawn(index);
      }
      ref = this.getChildren();
      for (j = ref.length - 1; j >= 0; j += -1) {
        item = ref[j];
        if (item.getTag() === TAG_CAR_LEFT && cc.rectIntersectsRect(this._rightLimit, item.getBoundingBox())) {
          this.removeChild(item);
        }
      }
      ref1 = this.getChildren();
      for (k = ref1.length - 1; k >= 0; k += -1) {
        item = ref1[k];
        if (item.getTag() === TAG_CAR_RIGHT && cc.rectIntersectsRect(this._leftLimit, item.getBoundingBox())) {
          this.removeChild(item);
        }
      }
    },
    _spawn: function(index) {
      var car, road, tempRect;
      cc.log("Put car in road " + index);
      road = this._roads[index];
      car = cc.Sprite.create("res/car.png");
      car.setPosition({
        x: road.x * this._tileSize.width + this._tileSizeHalf.width,
        y: road.y * this._tileSize.height + this._tileSizeHalf.height
      });
      this.addChild(car);
      tempRect = this._joinPosAndSize(car.getPosition(), this._tileSize);
      if (road.d > 0) {
        car.setTag(TAG_CAR_LEFT);
        car.runAction(this._runRight(tempRect));
      } else {
        car.setTag(TAG_CAR_RIGHT);
        car.runAction(this._runLeft(tempRect));
      }
    },
    onEnter: function() {
      this._super();
      this.scheduleOnce(this._updateEngine, this._initialInterval);
      this.schedule(this._checkHit, _CHECK_HIT);
    },
    _checkHit: function() {},
    _runLeft: function(_currentRect) {
      return new cc.MoveTo(1, {
        x: -_currentRect.width,
        y: _currentRect.y
      });
    },
    _runRight: function(_currentRect) {
      return new cc.MoveTo(1, {
        x: _currentRect.width * 11,
        y: _currentRect.y
      });
    },
    _death: function(pingu) {
      return cc.log("Death");
    },
    test: function(pinguBox) {
      var item, j, ref;
      ref = this.getChildren();
      for (j = ref.length - 1; j >= 0; j += -1) {
        item = ref[j];
        if ((item.getTag() === TAG_CAR_LEFT || item.getTag() === TAG_CAR_RIGHT) && cc.rectIntersectsRect(pinguBox, item.getBoundingBox())) {
          return true;
        }
      }
      return false;
    }
  });

}).call(this);

(function() {
  var TAG_PINGU, i;

  i = 2000;

  TAG_PINGU = ++i;

  this.GameScene = cc.Scene.extend({
    targetFrame: 15 / 60,
    realDeltaTime: 0,
    _positions: [],
    _stage: null,
    _carRandomEngine: null,
    _isStarted: false,
    _finishLine: null,
    _startOverlay: null,
    ctor: function() {
      this._super();
      return this._finishLine = cc.rect({
        x: 0,
        y: 12,
        width: 10,
        height: 3
      });
    },
    onEnter: function() {
      var startText, winSize;
      this._super();
      this.clickHandler = new OneTwoClickScene();
      this.addChild(this.clickHandler);
      this.tiledMap = cc.TMXTiledMap.create('res/stage.tmx');
      this.addChild(this.tiledMap);
      this._carRandomEngine = new CarRandom([
        {
          x: -1,
          y: 3,
          d: 1
        }, {
          x: 11,
          y: 4,
          d: -1
        }, {
          x: -1,
          y: 6,
          d: 1
        }, {
          x: 11,
          y: 7,
          d: -1
        }, {
          x: -1,
          y: 9,
          d: 1
        }, {
          x: 11,
          y: 10,
          d: -1
        }
      ], this.tiledMap);
      this.addChild(this._carRandomEngine);
      this.clickHandler.on('click', this._onOneClick, this);
      this.clickHandler.on('dbclick', this._onDoubleClick, this);
      this.schedule(this._testCollision);
      this._startOverlay = cc.LayerColor.create(new cc.Color(200, 100, 100, 100));
      startText = cc.LabelTTF.create("Start");
      startText.setAnchorPoint(.5, .5);
      winSize = cc.director.getWinSize();
      startText.setPosition(winSize.width / 2, winSize.height / 2);
      startText.setFontSize(80);
      this._startOverlay.addChild(startText);
      this.addChild(this._startOverlay);
    },
    startGame: function() {
      cc.log('===========');
      cc.log('Start Game');
      cc.log('===========');
      return this._addPingus(cc.p(2, 2));
    },
    _onOneClick: function() {
      var j, pingu, ref;
      cc.log('oneClick');
      if (this._isStarted) {
        ref = this.getChildren();
        for (j = ref.length - 1; j >= 0; j += -1) {
          pingu = ref[j];
          if (pingu.getTag() === TAG_PINGU) {
            pingu.onGoForward.bind(pingu)();
          }
        }
      } else {
        this._startOverlay.setVisible(false);
        this._isStarted = true;
        this.startGame();
      }
    },
    _onDoubleClick: function() {
      var j, pingu, ref;
      ref = this.getChildren();
      for (j = ref.length - 1; j >= 0; j += -1) {
        pingu = ref[j];
        if (pingu.getTag() === TAG_PINGU) {
          pingu.onGoBackward.bind(pingu)();
        }
      }
    },
    _addPingus: function(p) {
      var pingu;
      pingu = new Pingu(p.x, p.y, this.tiledMap);
      pingu.setTag(TAG_PINGU);
      return this.addChild(pingu);
    },
    _testCollision: function() {
      var j, pingu, ref;
      ref = this.getChildren();
      for (j = ref.length - 1; j >= 0; j += -1) {
        pingu = ref[j];
        if (pingu.getTag() === TAG_PINGU) {
          this._isCarHit(pingu);
        }
      }
    },
    _isCarHit: function(pingu) {
      if (this._carRandomEngine.test(pingu._sprite.getBoundingBox())) {
        if (!pingu._controlAuto) {
          return pingu.kill();
        }
      }
    }
  });

}).call(this);
