Polymer({
	is: "map-node",
	properties: {
		waterDiff: {
			type: Number,
			observer: "nodeChanged"
		},
		nodeStyle: String
	},
	/**
	 * Default ready function. Calls node Changed to ensure styles are set when view renders.
	 */
	ready:function() {
		this.nodeChanged();
	},
	/**
	 * Checks if the difference to the water level is positive (land) or negative (water)
	 * and calls the appropriate function
	 */
	nodeChanged: function() {
		if(this.waterDiff <= 0) {
			this.setNodeStyleBlue();
		} else {
			this.setNodeStyleBrown();
		}
	},
	/**
	 * Function sets the style for a node that represents water. Color gets darker depending on how large the difference
	 * between the water lvl and the node is.
	 */
	setNodeStyleBlue: function() {
		var style = "darkBlueNode";

		if(this.waterDiff > -5) {
			style = "lightBlueNode"
		} else if(this.waterDiff > -10) {
			style = "mediumBlueNode"
		}else if(this.waterDiff > -15) {
			style = "mediumDarkBlueNode"
		}

		this.set("nodeStyle", style)
	},
	/**
	 * Function sets the style for a node that represents land. Color gets darker depending on how large the difference
	 * between the water lvl and the node is.
	 */
	setNodeStyleBrown: function() {
		var style = "darkBrownNode";

		if(this.waterDiff < 5) {
			style = "lightBrownNode"
		} else if(this.waterDiff < 10) {
			style = "mediumBrownNode"
		}else if(this.waterDiff < 15) {
			style = "mediumDarkBrownNode"
		}

		this.set("nodeStyle", style)
	}
});