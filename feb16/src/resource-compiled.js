(function() {
  var i, len, ref, resId;

  this.res = {
    main: ['HelloWorld.png', 'res/pingu.png', 'res/car.png', 'res/stage.png', 'res/stage.tmx']
  };

  ref = this.res.main;
  for (i = 0, len = ref.length; i < len; i++) {
    resId = ref[i];
    console.log(resId);
  }

}).call(this);
