Polymer({
	is: "map-node",
	properties: {
		waterDiff: {
			type: Number,
			observer: "nodeChanged"
		},
		nodeStyle: String
	},
	ready:function() {
		this.nodeChanged();
	},
	nodeChanged: function() {
		if(this.waterDiff <= 0) {
			this.setNodeStyleBlue();
		} else {
			this.setNodeStyleBrown();
		}
	},
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