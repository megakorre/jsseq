var each_brake = "____list_break____";
var seq_fns = {};

function each(col, f) {
	while(true) {
		var x = col.first();
		if(x == null) break;
		else  {
			if(f(x) == each_brake) return;
			col = col.rest();
		}
	}
}

function seq(item) {
	var res = {
		first: item.first,
		rest: item.rest,
		each: function(f) {
		  each(item, f);
		},
		select: function(f) {
		  return seq(map(item, f));
		},
		where: function(f) {
		  return seq(filter(item, f));
		},
		reduce: function(f) {
		  return reduce(item, f);
		},
		fold: function(s, f) {
		  return fold(item, s, f);
		}
	};
	for(i in seq_fns) {
		res[i] = seq_fns[i];
	}
	return res;
}

function list_seq(col, index) {
	index = index || 0;
	return {
		first: function() {
			if(!(index < col.length)) 
				return null;
		  return col[index];
		},
		rest: function() {
		  return seq(list_seq(col, index + 1));
		}
	};
}

function hash_seq(hash) {
	var res = [];
	for (i in hash) {
		res.push({
			key: i,
			value: hash[i]
		});
	}
	return seq.from_list(res);
}

seq.from_list = function(col) {
	return seq(list_seq(col, 0));
}

seq.from_hash = function(hash) {
  return seq(hash_seq(hash));
}

function cons(item, col) {
	return {
		first: function() {
		  return item;
		},
		rest: function() {
		  return col;
		}
	}
}

function lazy(f) {
	var item = null;
	return {
		first: function() {
		  if(item == null) 
			  item = f();
		 	return item.first();
		},
		rest: function() {
		  if(item == null) item = f();
			return seq(item.rest());
		}
	};
}

function reduce(col, f) {
	var sed = col.first();
	if(sed == null) return null;
	col.rest().each(function(v) {
	  sed = f(sed, v);
	});
	return sed;
}

function fold(col, s, f) {
	col.each(function(v) {
	  s = f(s, v);
	})
	return s;
}

function map(col, f) {
	return lazy(function() {
	  var x = col.first();
		if(x == null) return null;
		else {
			return seq(cons(f(x), map(col.rest(), f)));
		}
	});
}

function filter(col, f) {
	return lazy(function() {
	  var x = col.first();
		if(x == null) return null;
		while(!f(x)) {
			col = col.rest();
			x = col.first();
			if(x == null) return null;
		}
		return seq(cons(x, filter(col.rest(), f)));
	});
}








