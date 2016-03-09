@Utils={}
@Utils.randomRange=(max, min)->
  parseInt((max - min + 1)*cc.random0To1() + min)