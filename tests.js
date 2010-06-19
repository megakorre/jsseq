
var tests_runned = 0;
var tests_passed = 0;
var tests_failed = 0;

function assert(msg, cond) {
	tests_runned++;
	var res = false;
	try {
		res = cond();
	} catch(e) {
		msg = msg + "<br />" + e;
	}
	if(!res) {
		document.write("======================================<br />");
		document.write("ERROR : " + msg + "<br />");
		document.write(cond.toString().replace(";", "; <br />"));
		document.write("<br />==================================<br />");
		tests_failed++;
	} else {
		tests_passed++;
	}
}

function run_tests() {

	assert("test from list", function() {
	  var x = seq.from_list([1,2]);
	  return x.eq(seq.cons(1,seq.cons(2, seq.empty())));
	});
	
	assert("can each", function() {
	  var x = seq.from_list([1,2,3,4]);
		var other = 0;
		x.each(function(v) {
		  other += v;
		});
		return other == 10;
	});
	
	assert("test can sum seq", function() {
	  var x = seq.from_list([1,2,3,4]);
		return x.sum() == 10;
	});

	assert("test map", function() {
	  var items = seq.from_list([1,2,3,4])
			.select(function(v) {
				return v + 1;
			});
		return items.sum() == 14;
	});
	
	assert("test reduce", function() {
	  var items = seq.from_list([1,2,3,4]);
		var agger = items.reduce(function(p,c) {
		  	return p + c;
		});
		return agger == 10;
	});
	
	assert("test filter", function() {
		var items = seq.from_list([1,2,3,4])
			.where(function(v) {
			  return (v % 2) == 0;
			});
		return items.sum() == 6;
	});
	
	assert("test seq_eq can handle equal seq's", function() {
	  var l1 = seq.from_list([1,2,3,4]);
		var l2 = seq.from_list([1,2,3,4]);
		return l1.eq(l2);
	});
	
	assert("test seq_eq can handle non equal seq's", function() {
	  	var l1 = seq.from_list([1,2,3,5]);
			var l2 = seq.from_list([1,2,3,4]);	
			return !l1.eq(l2);
	});
	
	assert("test seq_eq can handle seq's of diferent length", function() {
	  var l1 = seq.from_list([1,2,3,5,6,7,8,9]);
		var l2 = seq.from_list([1,2,3,4]);
		return !l1.eq(l2);
	});
	
	assert("can concatt two seq's", function() {
	  var l1 = seq.from_list([1,2]);
		var l2 = seq.from_list([1,2]);
		return l1.concat(l2).eq(seq.from_list([1,2,1,2]));
	});
	
	assert("can convert to list", function() {
	  var li = seq.from_list([1,2]);
		// lists cant do == for some reson
		return seq.from_list(li.to_list()).eq(seq.from_list([1,2]));
	});
	
	assert("can flatten list", function() {
	  var li = seq.from_list([
			seq.from_list([1, 2, 3]),
			seq.from_list([4, 5, 6])
		]);
		return li.flatten().eq(seq.from_list([1,2,3,4,5,6]));
	});

	assert("can use where_index", function() {
	  var li = seq.from_list([{ t: 2, b: 3 },{ t: 2, b: 3 },{ t: 2, b: 3 },{ t: 1, b: 3 }]);
		return li.where_index("t", function(v) {
		  return v == 2;
		}).count() == 3;
	});

	assert("can get list from range", function() {
	  var li = seq.from_range(0,5);
		var li2 = seq.from_range(5);
		var li3 = seq.from_range(0,1,5);
		
		return li.eq(li2) && li.eq(li3);
	});
	
	assert("can count", function() {
	  var li = seq.from_range(20);
		return li.count() == 20;
	});
	
	assert("can bind", function() {
	  var li = seq.from_range(5)
			.bind(function(v) {
			  return seq.from_range(v);
			});
		return li.count() == 10;
	});
	
	assert("can fold a list", function() {
	  var li = seq.from_range(5)
		  .fold(4, function(p,c) {
		  	return p + c;
			});
		return li == 14;
	});
	
	assert("can use easy generator function", function() {
	  var li = seq.gen(function(y) {
	    for (var i=0; i < 10; i++) {
	    	y(i);
	    }
	  });
		return li.count() == 10;
	});
	
	assert("can use seq.from_callback", function() {
	  var x = 0;
		var li = seq.from_callback(function() {
		  if(x < 10) {
				x++;
				return (x - 1);
			} else {
				return null;
			}
		});
		return li.count() == 10;
	});
	
	assert("can reverse seq", function() {
	  var li = seq.from_list([1,2,3]);
		return li.reverse().eq(seq.from_list([3,2,1]));
	});
	
	assert("can order-by some field", function() {
	  var li = seq.from_hash({ a: 2 , b: 4, c: 1 })
			.order_by("value")
			.select(function(v) {
			  return v.key;
			});
		return li.eq(seq.from_list(["c","a","b"]));
	});
	
	
	assert("can scan list", function() {
	  var li = seq.from_list([1,2,3,4,5])
							.scan(0, function(p, c) {
							  	return p + c;
							});
		return li.eq(seq.from_list([1,3,6,10,15]));
	});
	
	assert("seq function can dispatch on list", function() {
	  var x = seq([1,2,3,4]);
		return x.sum() == 10;
	});
	
	assert("can use nth", function() {
	  var x = seq([1,2,3,4]);
		return x.nth(2) == 3;
	});
	
	
	document.write("<h1>Ran Tests</h1>");
	document.write("<h3>tests runned: "+ tests_runned +"</h3>");
	document.write("<h3>tests passed: "+ tests_passed +"</h3>");
	document.write("<h3>tests failed: "+ tests_failed +"</h3>");
	document.write("==========================================");
}

