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
		test_failed++;
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
	
	document.write("<h1>Ran Tests</h1>");
	document.write("<h3>tests runned: "+ tests_runned +"</h3>");
	document.write("<h3>tests passed: "+ tests_passed +"</h3>");
	document.write("<h3>tests failed: "+ tests_failed +"</h3>");
	document.write("==========================================");
}

