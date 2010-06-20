var seq = null;
(function() {
  var fns = {};
  var dispatches = {};
  
  seq = function(item) {
    if(item.__seq__) {
      return item;
    }
    if(item.constructor !== undefined && item.first === undefined) {
      return seq(dispatches[item.constructor](item));
    }
    var res = {
      __seq__: true,
      first: item.first,
      rest: item.rest
    };
    for(name in fns) {
      res[name] = fns[name];
    }
    return res;
  };
  
  seq.each_break = "____each_breake_____";
  
  /* adds a test to use in seq.eq 
     to check if two arrays are equal */
  function Array_eq(a1, a2) {
    for(var i = 0; i < a1.length; i++) {
      if(i >= a2.length) {
	return false;
      }
      if(a1[i] == a2[i]) {
	continue;
      }
      else {
	return false;
      }
    }
    return true;
  }
  
  seq.cons = function(item, col) {
    return seq({
      first: function() {
	return item;
      },
      rest: function() {
	return col;
      }
    });
  };
  
  seq.add_methods = function(methods) {
    for(name in methods) {
      fns[name] = methods[name];
    }
  };
  
  seq.add_dispatch = function(dispatcher, f) {
    dispatches[dispatcher] = f;
  };
  
  seq.add_methods({
    
    each: function(f) {
      var col = this;
      while(true) {
	var x = col.first();
	if(x === null) {
	  break;
	}
	if(f(x) == seq.each_break) {
	  return;
	}
	col = col.rest();
      }
    },
    
    reduce: function(f) {
      var sed = this.first();
      if(sed === null) {
	return null;
      }
      this.rest().each(function(v) {
	sed = f(sed, v);
      });
      return sed;
    },
    
    fold: function(s,f) {
      this.each(function(v) {
	s = f(s, v);
      });
      return s;
    },
    
    eq: function(col2) {
      var col1 = this;
      while(true) {
	var f1 = col1.first();
	var f2 = col2.first();
	if(f1 == f2) {
	  if(f1 === null) {
	    return true;
	  }
	  else {
	    col1 = col1.rest();
	    col2 = col2.rest();
	  }
	} else {
	  return false;
	}
      }
    },
    
    concat: function(col2) {
      var col1 = this;
      return seq.lazy(function() {
	var x = col1.first();
	if(x === null) {
	  return col2;
	} else {
	  return seq.cons(x, col1.rest().concat(col2));
	}
      });
    },
    
    where_index: function(ind,f) {
      var col = this;
      return seq.lazy(function() {
	var x = col.first();
	if(x === null) {
	  return null;
	}
	while(!f(x[ind])) {
	  col = col.rest();
	  x = col.first();
	  if(x === null) {
	    return null;
	  }
	}
	return seq.cons(x, col.rest().where_index(ind, f));
      });
    },
    
    select: function(f) {
      var col = this;
      return seq.lazy(function() {
	var x = col.first();
	if(x === null) {
	  return null;	
	}
	return seq.cons(f(x), col.rest().select(f));
      });
    },
    
    sum: function() {
      var res = 0;
      this.each(function(v) {
	res += v;
      });
      return res;
    },
    
    where: function(f) {
      var col = this;
      return seq.lazy(function() {
	var x = col.first();
	if(x === null) {
	  return null;
	}
	while(!f(x)) {
	  col = col.rest();
	  x = col.first();
	  if(x === null) {
	    return null;
	  }
	}
	return seq.cons(x, col.rest().where(f));
      });
    },
    
    flatten: function() {
      var col = this;
      return seq.lazy(function() {
	var x = col.first();
	if(x === null) {
	  return null;
	}
	return seq(x).concat(col.rest().flatten());
      });
    },
    
    count: function() {
      var i = 0;
      this.each(function() {
	i++;
      });
      return i;
    },
    
    reverse: function() {
      var col = this;
      return seq.lazy(function() {
	var li = seq(col).to_list();
	return seq.from_list(li.reverse());
      });
    },
    
    order_by: function(index) {
      var col = this;
      return seq.lazy(function() {
	var item = col.first();
	if(item === null) {
	  return null;
	}
	var smaller = 
	  col.rest().where(function(v) {
	    return v[index] <= item[index];
	  });
	var larger = 	
	  col.rest().where(function(v) {
	    return v[index] > item[index];
	  });
	return smaller.order_by(index).concat(seq.cons(item, larger.order_by(index)));
      });
    },
    
    bind: function(f) {
      var col = this;
      return seq.lazy(function() {
	var x = col.first();
	if(x === null) {
	  return null;
	}
	else {
	  return f(x).concat(col.rest().bind(f));
	} 		
      });
    },
    
    scan: function(s,f) {
      var lis = this;
      return seq.lazy(function() {
	var x = lis.first();
	if(x === null) {
	  return null;
	}
	var inter = f(s, x);
	return seq.cons(inter, lis.rest().scan(inter , f));
      });
    },
    
    to_list: function() {
      var li = [];
      this.each(function(v) {
	li.push(v);
      });
      return li;
    },
    
    cons: function(item) {
      return seq.cons(item, this);
    }
    
  });
  
  var list_seq = function(col, index) {
    index = index || 0;
    return seq({
      first: function() {
	if(index >= col.length) {
	  return null;
	}
	return col[index];
      },
      rest: function() {
	return list_seq(col, index + 1);
      }
    });
  };
	
  /**
     
   */
  seq.from_list = function(col) {
    return list_seq(col);
  };
  
  seq.add_dispatch(Array, function(li) {
    return seq.from_list(li);
  });
  
  /* gives you a infinit range starting from
     0
  **/
  seq.lazy_range = function() {
    var i = 0;
    return seq.from_callback(function() {
      return i++;
    });
  };
	
  /**
   *
   *****/
  seq.from_range = function(start, step, end) {
    if(step === undefined && end === undefined) {
      end = start;
      start = 0;
      step = 1;
    } else {
      if(end === undefined) {
	end = step;
	step = 1;
      } 
    }
    var li = [];
    while(start != end) {
      li.push(start);
      start = start + step;
    }
    return seq.from_list(li);
  };
	
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
  
  seq.from_hash = function(hash) {
    return seq(hash_seq(hash));
  };
  
  seq.lazy = function(f) {
    var start = "___start___";
    var item = start;
    var cach = null;
    return seq({
      first: function() {
	if(item == start) {
	  item = f();
          if(item === null) { return null; }
          cach = item.first();
	}
	return cach;
      },
      rest: function() {
	if(item == start) {
	  item = f();
          if(item === null) { return null; }
          cach = item.first();
	}
        if(item == null) {
          return seq.empty();
        }
	return item.rest();
      }
    });
  };
  
  function callback_seq(callback) {
    var start = "___________start__________";
    var item = start;
    return seq({
      first: function() {
	if(item == start) {
	  item = callback();
	}
	if(item === null) {
	  return null;	
	}
	else {
	  return item;
	}
      },
      rest: function() {
	if(item == start) {
	  item = callback();	
	}
	return callback_seq(callback);
      }
    });
  }
  
  seq.from_callback = function(callback) {
    return callback_seq(callback);
  };
  
  seq.gen = function(f) {
    return seq.lazy(function() {
      var catches = [];
      var x = f(function(v) {
	catches.push(v);
      });
      return seq.from_list(catches); 
    });
  };
  
  seq.empty = function() {
    return seq({
      first: function() {
	return null;
      },
      rest: function() {
	return seq.empty();
      }
    });
  };
	  
  seq.add_methods({
    
    /* returns the nth method in the seq */
    nth: function(n) {
      if(n == 0) return this.first();
      var col = this;
      var i = 0;
      while(i != n) {
	col = col.rest();
	i++;
      }
      return col.first();
    },
    
    /* return the secod item in the seq */
    second: function() {
      return this.nth(1);
    },
    
    /* returns the therd item in the seq */
    third: function() {
      return this.nth(2);
    },
    
    /* returns the fourth item in the collection */
    forth: function() {
      return this.nth(3);
    },
    
    /* join together to seq as pairs [x,z] */
    zip: function(col2) {
      var col1 = this;
      return seq.lazy(function() {
	var x = col1.first();
	var y = col2.first();
	if(y === null || x === null) {
	  return null;
	}
	return seq.cons([x,y], col1.rest().zip(col2.rest()));
      });
    },
    
    /* takes num items from the seq or how manny there is left */
    take: function(num) {
      var col = this;
      return seq.lazy(function() {
	if(num == 0) {
	  return seq.empty();
	}
	return seq.cons(col.first(), col.rest().take(num - 1));
      });
    },
    
    /* skips n items in the seq */
    skip: function(num) {
      var col = this;
      return seq.lazy(function() {
	while(true) {
	  var x = col.first();
	  if(x === null) {
	    return null;
	  }
	  if(num == 0) {
	    return col;
	  }
	  col = col.rest();
	  num--;
	}
      });
    },
    
    /**
      @return true or false depending if the collection starts with
      the argument 
     */
    starts_with: function(col2) {
      var length = col2.count();
      if(this.count() < length) {
        return false;
      } else {
        return this.take(length).eq(col2);
      }
    }
  });
  
})();

