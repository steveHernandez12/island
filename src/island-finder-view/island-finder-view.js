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
	/**
	 * Default ready function. Calls resetIslandInputGrid to ensure the input grid is initialized and rendered on the view
	 */
	ready: function() {
		this.resetIslandInputGrid();
	},
	/**
	 * Function is triggered by the on-change event of the height and width input box
	 */
	heightWidthChanged: function() {
		// If height and width are positive it is valid
		// Clears the solution matrix, resets the error message, and updates the input grid
		if(this.height > 0 && this.width > 0) {
			this.clear();
			// If the height or width is greater than 10 a warning is shown to the user
			// to inform the of possible performance issues
			var message = this.height >= 10 || this.width >= 10 ? "Warning: Large grids may result in slower performance" : "";
			this.set("errorMessage", message);
			this.resetIslandInputGrid();

		// Else, height or width aren't valid so we show an error message and reset height and width
		// to the current size of the matrix
		} else {
			this.set("errorMessage", "Invalid height or width");
			this.set("height", this.islandMatrix.length);
			this.set("width", this.islandMatrix[0].length);
		}
	},
	/**
	 * On-change function for the water lvl input field.
	 * When a change occurs the matrix is updated so each node has the new difference value
	 */
	waterLvlChanged: function() {
		this.clear();
		var newMatrix = [];
		for(var h = 0; h < this.height; h++) {
			var newRow = [];
			for(var w = 0; w < this.width; w++) {
				var oldItem = this.islandMatrix[h][w];
				// set an object that has the old node value, recalculate the diff from the waterLvl
				// and set checked to false
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
	/**
	 * Function that resets the island input map to default values
	 */
	resetIslandInputGrid: function() {
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
	/**
	 * on-change function that is called by a single node in the island input grid.
	 * Calculates the difference between the node and the water lvl and updates the islandMatrix
	 * @param e - event object of the updated grid node
	 */
	updateIslandGridNode: function(e) {
		this.clear();
		var tempMatrix = this.islandMatrix;
		// Get the row and col values out of the data fields on the input
		var row = e.target.dataRow;
		var col = e.target.dataCol;
		var matrixNode = tempMatrix[row][col];
		matrixNode.waterDiff = matrixNode.nodeValue - this.waterLvl;
		tempMatrix[row][col] = matrixNode;
		this.set("islandMatrix", tempMatrix);
	},
	/**
	 * On-click method for the solve button. Loops through the islandMatrix and begins finding the number of islands
	 */
	solve: function() {
		var cnt = 0;
		for(var x=0; x<this.height; x++) {
			for(var y=0; y<this.width; y++) {
				if (this.islandMatrix[x][y].waterDiff > 0) {
					cnt = cnt + this.findIsland(this.islandMatrix,x,y, 0);
				}
			}
		}

		// Set the Completed map so that it will trigger the redraw of the solution grid
		this.set("completedIslandMap", this.islandMatrix);

		//Set the number of islands property
		this.set("numberOfIslands", cnt);

		// Once its all done we reset the checked flag on each node
		this.reset();
	},
	/**
	 * Function that clears out the completed matrix. This is so the observer on the map-node fires properly
	 */
	clear: function() {
		this.set("completedIslandMap", []);
	},
	/**
	 * Function that determines if the node at index x_in and y_in is part of an island.
	 * @param A - the 2 dimensional array being looked at
	 * @param x_in - x index
	 * @param y_in - y index
	 * @param cur_cnt - current counter (usually 0 or 1)
	 * @returns {Number} - 0 or 1 for the number of Islands found
	 */
	findIsland: function(A, x_in, y_in, cur_cnt) {
		A[x_in][y_in].checked = true;

		// Determine if the current node is a single node island
		if(this.surroundedByWater(x_in, y_in, A)) {
			cur_cnt = 1;
		}

		// Check if the coordinates one row back exists and is valid
		if (this.coordinate_exists(x_in-1, y_in, A)) {
			this.findIsland(A,x_in-1,y_in  ,cur_cnt);
			cur_cnt = 1;
		}

		// Check if the coordinates one row forward exists and is valid
		if (this.coordinate_exists(x_in+1, y_in, A)) {
			this.findIsland(A,x_in+1,y_in  ,cur_cnt);
			cur_cnt = 1;
		}

		// Check if the coordinates one column back exists and is valid
		if (this.coordinate_exists(x_in  ,y_in-1, A)) {
			this.findIsland(A,x_in  ,y_in-1,cur_cnt);
			cur_cnt = 1;
		}

		// Check if the coordinates one column forward exists and is valid
		if (this.coordinate_exists(x_in  ,y_in+1, A)) {
			this.findIsland(A,x_in  ,y_in+1,cur_cnt);
			cur_cnt = 1;
		}

		return cur_cnt;
	},
	/**
	 * Function that resets the checked property of each node in the islandMatrix
	 */
	reset: function() {
		for(var x=0; x<this.height; x++) {
			for(var y=0; y<this.width; y++) {
				this.islandMatrix[x][y].checked = false;
			}
		}
	},
	/**
	 * Function that checks if the coordinates x_in and y_in is valid and if the node at the index is valid
	 * @param x_in - x index
	 * @param y_in - y index
	 * @param A - array to be searched
	 * @returns {Boolean} - true or false depending if the coordinates are valid and if the node is valid
	 */
	coordinate_exists: function(x_in, y_in, A) {
		if (this.indexValid(x_in, y_in)) {
			// returns true if the node is above water lvl and it hasn't been checked
			return A[x_in][y_in].waterDiff > 0 && !A[x_in][y_in].checked;
		}

		return false;
	},
	/**
	 * Helper to check if the indexes are valid
	 * @param x - x index
	 * @param y - y index
	 * @returns {boolean} - true if x and y are within the limits of the islandMatrix
	 */
	indexValid: function(x, y) {
		return x >= 0 && x <= (this.height-1) && y >= 0 && y <= (this.width-1)
	},
	/**
	 * Helper function to determine if the node is surrounded by water.
	 * Boundaries of the matrix are considered water
	 * @param x - x index
	 * @param y - y index
	 * @param A - 2 dimensional array
	 * @returns {boolean} - true if the node at x and y is surrounded by water or boundaries
	 */
	surroundedByWater: function(x, y, A) {
		// Returns true if:
		// Node one row below is invalid or its valid and below water lvl
		// and node one row above is invalid or its valid and below water lvl
		// and node one column before is invalid or its valid and below water lvl
		// and node one column after is invalid or its valid and below water lvl
		return ((!this.indexValid(x - 1, y) || (this.indexValid(x - 1, y) && A[x - 1][y].waterDiff <= 0))
		&& (!this.indexValid(x + 1, y) || (this.indexValid(x + 1, y) && A[x + 1][y].waterDiff <= 0))
		&& (!this.indexValid(x, y - 1) || (this.indexValid(x, y - 1) && A[x][y - 1].waterDiff <= 0))
		&& (!this.indexValid(x, y + 1) || (this.indexValid(x, y + 1) && A[x][y + 1].waterDiff <= 0)));
	}
});