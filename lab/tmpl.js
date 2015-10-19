var tmpl = function(data,scopes) {
    var t=new FireTPL.Runtime(),h=t.execHelper,l=FireTPL.locale,f=FireTPL.fn,p=t.execInclude;
    scopes=scopes||{};
    var root=data,parent=data;
    var dataFn = scopes.dataFn || f.escape;
    var htmlFn = scopes.htmlFn || f.raw;
    var scopeFn = scopes.scopeFn || function(scopeId) {
        return scopes[scopeId];
    };

    scopes.scope002=function(data,parent){
        var s='';
        var c=data;
        var r=h('if',c,parent,root,function(data){
            var s='';
            s+='<img src="'+f.escape(data.image)+'">';
            return s;
            
        });
        s+=r;
        return s;
        
    };
    scopes.scope001=function(data,parent){
        var s='';
        s+=h('each',data,parent,root,'ul','class=listing',function(data){
            var s='';
            s+='<li><span class="name">'+dataFn('name',data)+'</span><span class=image>';
            s+=scopeFn('scope002','image',data);
            s+='</span></li>';
            return s;
            
        });
        return s;
        
    };
    var s='';
    s+='<div class="example"><h1>'+dataFn('title')+'</h1><div class="description">'+dataFn('description')+'</div><ul class=listing>';
    s+=scopeFn('scope001','listing',data);
    s+='</ul></div>';
    return s;
    
};

var scopesMap = {};

var data = {};
var scopes = {
    dataFn: function(path) {

    },
    scopeFn: function(scopeId, path, data) {

    }
};


//command: push('listing', {})

scopesMap = {
    listing: [{
        fn: scopes.scope001,
        parent: 'elemet1',
        childs: []
    },
    'listing.name': [{
        fn: scopes.scope001,
        parent: 'elemet1',
        childs: []  
    }]
};