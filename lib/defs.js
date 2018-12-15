const defs = require("../config/data/definitions");

class DefVersioner {
	static getVersion(defName, mod) {
		if(defs[defName][mod.majorPatchVersion])
			return defs[defName][mod.majorPatchVersion];
		else
			return defs[defName]["default"];
	}
};

module.exports = DefVersioner;