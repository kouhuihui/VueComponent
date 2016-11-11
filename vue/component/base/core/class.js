/*
* 基础类 class
*/
var Class = {
    extend: function(_parent, _child){
        for(var i in _parent){
            if(typeof _parent[i] === 'function'){
                _child[i] = _parent[i];
            }else{
                for(var j in _parent[i]){
                    _child[i][j] = _parent[i][j];
                }
            }
        }
    }
}

module.exports = Class;
