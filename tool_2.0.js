//--------------------------------------------工具API----------------------------------------
/**
 * getRandom 获取一个【m,n】的随机数字
 *
 */
var T = {
  getRandom: function(m, n) {
    return Math.floor(Math.random * (n - m + 1) + m)
  }
}
