var each_brake = "____list_break____";
var seq_fns = {};

function each(col, f) {
	while(true) {
		var x = col.first();
		if(x == null) break;
		else  {
			if(f(x) == seq.each_brake) return;
			col = col.rest();
		}
	}
}

function seq(item) {
	if(item == null) return null;
	if(item._seq_) return item;
	var res = {
		_seq_: true,
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
		},
		sum: function() {
		  return sum(item);
		},
		eq: function(col) {
		  return seq_eq(item, col);
		},
		concat: function(col) {
		  return concat(item, col);
		},
		to_list: function() {
		  return to_list(item);
		},
		flatten: function() {
		  return flatten(item);
		},
		count: function() {
		  return count(item);
		},
		bind: function(f) {
		  return bind(item, f);
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

seq.from_range = function(start, step, end) {
	if(step == undefined && end == undefined) {
		end = start;
		start = 0;
		step = 1;
	} else {
		if(end == undefined) {
			end = step;
			step = 1;
		} 
	}
	var li = [];
	while(start < end) {
		li.push(start);
		start = start + step;
	}
	return seq.from_list(li);
}

seq.from_hash = function(hash) {
  return seq(hash_seq(hash));
}

seq.each_brake = "______each___brake____";

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
			if(item == null) return null;
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

function seq_eq(col1, col2) {
	while(true) {
		var f1 = col1.first();
		var f2 = col2.first();
		if(f1 == f2) {
			if(f1 == null) return true;
			else {
				col1 = col1.rest();
				col2 = col2.rest();
			}
		} else {
			return false;
		}
	}
}

function concat(col1, col2) {
	return seq(lazy(function() {
	  var x = col1.first();
		if(x == null) {
			return col2;
		} else {
			return seq(cons(x, concat(col1.rest(), col2)));
		}
	}));
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

function sum(col) {
	return seq(col).reduce(function(c,p) {
	  return c + p;
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

function flatten(col) {
	return seq(lazy(function() {
	  var x = col.first();
		if(x == null) return null;
		return seq(x).concat(flatten(col.rest()));
	}));
}

function count(col) {
	var i = 0;
	seq(col).each(function() {
	  i++;
	});
	return i;
}

function bind(col, f) {
	return seq(lazy(function() {
	  var x = col.first();
		if(x == null) return null;
		else {
			return f(x).concat(
				bind(col.rest(), f));
		}
	}));
}

function to_list(col) {
	var li = [];
	seq(col).each(function(v) {
	  li.push(v);
	});
	return li;
}






