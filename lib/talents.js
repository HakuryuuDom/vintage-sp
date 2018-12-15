const state = require("./state");
const utils = require("./utils");
const def = require("./defs");

class TalentPrediction {
	constructor(mod) {
		this.talents = new Map();

		mod.hook("S_LEARN_EP_PERK", def.getVersion("S_LEARN_EP_PERK"), (event) => {
			if (!event.successful)
				return;
			for (let perk of event.perks) {
				if (this.talents.has(perk.id))
					this.talents.delete(perk.id);
				this.talents.set(perk.id, perk.level);
			}
		});

		mod.hook("S_LOAD_EP_INFO", def.getVersion("S_LOAD_EP_INFO"), (event) => {
			for (let perk of event.perks) {
				this.talents.set(perk.id, perk.level);
			}
		});

		mod.hook("S_RETURN_TO_LOBBY", "raw", () => {
			this.talents.clear();
		});
	}

	exists(id) {
		return this.talents.has(id);
	}

	getLevel(talentId) {
		return this.talents.get(talentId);
	}

	inMap(map) {
		for (let key of this.talents.keys()) {
			if (map[key])
				return true;
		}
		return false;
	}
};

module.exports = function Require(mod) {
	if (map.has(mod)) return map.get(mod);

	let talent = new TalentPrediction(mod);
	map.set(mod, talent);
	return talent;
};
