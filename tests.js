function assert(msg, cond) {
	if(!cond()) {
		document.write("======================================\n");
		document.write("ERROR : " + msg + "\n");
		document.write(cond.toString());
		document.write("\n==================================\n");
	}
}

function run_tests() {
	
	/* test can nest seq querys */
	var list = seq.from_list([1,2,3,4,5])
		.select(function(v) { return v + 1; })
		.where(function(v) { return (v % 2) != 0; });
	
	var state = 0;
	list.each(function(v) {
	   state++;
	});
	assert("cant nest querys", function() {
	  return state == 2;
	})
	/**/
	
}

