var Tool = function(){}
tool.prototype={
	constructor:'Tool',
	getRandom:function(m,n){
		return Math.floor(Math.getRandom()*(m-n+1)+n)
	}
}
window.$ = window.tool = Tool