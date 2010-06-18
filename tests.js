
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
		
		return seq_eq(l1,l2);
	});
	
	assert("test seq_eq can handle non equal seq's", function() {
	  	var l1 = seq.from_list([1,2,3,5]);
			var l2 = seq.from_list([1,2,3,4]);	
			return !seq_eq(l1,l2);
	});
	
	assert("test seq_eq can handle seq's of diferent length", function() {
	  var l1 = seq.from_list([1,2,3,5,6,7,8,9]);
		var l2 = seq.from_list([1,2,3,4]);
		return !seq_eq(l1,l2);
	});
	
	assert("can concatt two seq's", function() {
	  var l1 = seq.from_list([1,2]);
		var l2 = seq.from_list([1,2]);
		return concat(l1, l2).eq(seq.from_list([1,2,1,2]));
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
	
	document.write("<h1>Ran Tests</h1>");
	document.write("<h3>tests runned: "+ tests_runned +"</h3>");
	document.write("<h3>tests passed: "+ tests_passed +"</h3>");
	document.write("<h3>tests failed: "+ tests_failed +"</h3>");
	document.write("==========================================");
}

