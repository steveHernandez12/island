Polymer({
	is: "island-finder-view",
	properties: {
		height: {
			type: Number,
			value: 1
		},
		width: {
			type: Number,
			value: 1
		},
		waterLvl: {
			type: Number,
			value: 0
		},
		errorMessage: String,
		numberOfIslands: {
			type: Number,
			value: 0
		},
		islandMatrix: Array,
		completedIslandMap: {
			type: Array
		}
	},
	ready: function() {
		this.updateMatrix();
	},
	heightWidthChanged: function() {
		if(this.height > 0 && this.width > 0) {
			this.clear();
			this.set("errorMessage", "");
			this.updateMatrix();
		} else if(this.height >= 10 || this.width >= 10) {
			this.set("errorMessage", "Warning: Large grids may result in slower performance");
		} else {
			this.set("errorMessage", "Invalid height or width");
			this.set("height", this.islandMatrix.length);
			this.set("width", this.islandMatrix[0].length);
		}
	},
	waterLvlChanged: function() {
		this.clear();
		var newMatrix = [];
		for(var h = 0; h < this.height; h++) {
			var newRow = [];
			for(var w = 0; w < this.width; w++) {
				var oldItem = this.islandMatrix[h][w];
				newRow[w] = {
					nodeValue: oldItem ? oldItem.nodeValue : 0,
					waterDiff: oldItem.nodeValue - this.waterLvl,
					checked: false
				};
			}
			newMatrix.push(newRow);
		}
		this.set("islandMatrix", newMatrix);
	},
	updateMatrix: function() {
		var newMatrix = [];
		for(var h = 0; h < this.height; h++) {
			var newRow = [];
			for(var w = 0; w < this.width; w++) {
				newRow[w] = {
					nodeValue: 0,
					waterDiff: 0,
					checked: false
				};
			}
			newMatrix.push(newRow);
		}
		this.set("islandMatrix", newMatrix);
	},
	updateMatrixNode: function(e) {
		this.clear();
		var tempMatrix = this.islandMatrix;
		var row = e.target.dataRow;
		var col = e.target.dataCol;
		var matrixNode = tempMatrix[row][col];
		matrixNode.waterDiff = matrixNode.nodeValue - this.waterLvl;
		tempMatrix[row][col] = matrixNode;
		this.set("islandMatrix", tempMatrix);
	},
	solve: function() {
		var cur_cnt;
		var cnt = 0;
		for(var x=0; x<this.height; x++) {
			for(var y=0; y<this.width; y++) {
				if (this.islandMatrix[x][y].waterDiff > 0) {
					cur_cnt = 0;
					cnt = cnt + this.clean_block(this.islandMatrix,x,y, cur_cnt);
				}
			}
		}

		this.set("completedIslandMap", this.islandMatrix);
		this.set("numberOfIslands", cnt);

		this.reset();
	},
	clear: function() {
		this.set("completedIslandMap", []);
	},
	clean_block: function(A, x_in, y_in, cur_cnt) {
		A[x_in][y_in].checked = true;
		if(this.surroundedByWater(x_in, y_in, A)) {
			cur_cnt = 1;
		}


		if (this.coordinate_exists(x_in-1, y_in, A)) {
			this.clean_block(A,x_in-1,y_in  ,cur_cnt);
			cur_cnt = 1;
		}
		if (this.coordinate_exists(x_in+1, y_in, A)) {
			this.clean_block(A,x_in+1,y_in  ,cur_cnt);
			cur_cnt = 1;
		}
		if (this.coordinate_exists(x_in  ,y_in-1, A)) {
			this.clean_block(A,x_in  ,y_in-1,cur_cnt);
			cur_cnt = 1;
		}
		if (this.coordinate_exists(x_in  ,y_in+1, A)) {
			this.clean_block(A,x_in  ,y_in+1,cur_cnt);
			cur_cnt = 1;
		}

		return cur_cnt;
	},
	reset: function() {
		for(var x=0; x<this.height; x++) {
			for(var y=0; y<this.width; y++) {
				this.islandMatrix[x][y].checked = false;
			}
		}
	},
	coordinate_exists: function(x_in, y_in, A) {
		if (this.indexValid(x_in, y_in)) {
			return A[x_in][y_in].waterDiff > 0 && !A[x_in][y_in].checked;
		}
		else {
			return 0;
		}
	},
	indexValid: function(x, y) {
		return x >= 0 && x <= (this.height-1) && y >= 0 && y <= (this.width-1)
	},
	surroundedByWater: function(x, y, A) {
		return ((!this.indexValid(x - 1, y) || (this.indexValid(x - 1, y) && A[x - 1][y].waterDiff <= 0))
		&& (!this.indexValid(x + 1, y) || (this.indexValid(x + 1, y) && A[x + 1][y].waterDiff <= 0))
		&& (!this.indexValid(x, y - 1) || (this.indexValid(x, y - 1) && A[x][y - 1].waterDiff <= 0))
		&& (!this.indexValid(x, y + 1) || (this.indexValid(x, y + 1) && A[x][y + 1].waterDiff <= 0)));
	}
});