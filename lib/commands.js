const AutoConfig = require("./autoconfig");
const Ping = require("./ping");
const state = require("./state");

class Cmds {
	constructor(mod) {
		const autoconf = AutoConfig(mod);
		const ping = Ping(mod);

		//Commands
		mod.command.add("sp", {
			info() {
				mod.command.message("Unofficial Public SP. Date:29/10/18");
				//mod.command.message(`Class=${me.job}, race=${me.race}`);
				mod.command.message(`Config: timeout: ${state.config.serverTimeout}, retries: ${state.config.skillRetryCount}, jitter comp: ${state.config.jitterCompensation}, RetryMs: ${state.config.skillRetryMs}`);
			},
			config: {
				generate() {
					if (ping.history.length === state.config.pingHistoryMax) {
						mod.command.message("Gathering information ... Please wait ...");
						let returnedConfig = autoconf.Analyze(Object.assign({}, state.config), ping.min, ping.avg, ping.max);
						if (!returnedConfig) {
							mod.command.message("Try to repeat this command after 2-3min.");
							return;
						}
						mod.command.message("The configuration in memory has been overwritten.");
						state.config = returnedConfig;
						mod.command.message("You can test changes and use command /8 sp config save for saving the configuration just created.");
					} else {
						mod.command.message("Not enough measurements for ping. Try to repeat command a bit later.");
					}
				},
				help() {
					mod.command.message("All info in /docs folder :)");
				},
				print() {
					mod.command.message("Current config:");
					for (let [key, value] of Object.entries(state.config))
						mod.command.message(`${key}:${value}`);
				},
				reset() {
					state.ResetConfig();
					mod.command.message("Default configuration file loaded.");
					mod.command.message("You can test changes and use command /8 sp config save for saving the changes.");
				},
				save() {
					state.SaveConfig();
					mod.command.message("Configuration file saved.");
				},
				reload() {
					state.ReloadConfig();
					mod.command.message("Configuration file reloaded.");
				},
			},
			debug() {
				if (state.config.debug)
					mod.command.message("Main Debug mode deactivated.");
				else
					mod.command.message("Main Debug mode activated.");

				state.config.debug = !state.config.debug;
			},
			debugloc() {
				if (state.config.debugLoc)
					mod.command.message("Location debug mode deactivated.");
				else
					mod.command.message("Location debug mode activated.");

				state.config.debugLoc = !state.config.debugLoc;
			},
			debugabnorm() {
				if (state.config.debugAbnormals)
					mod.command.message("Abnormals debug mode deactivated.");
				else
					mod.command.message("Abnormals debug mode activated.");

				state.config.debugAbnormals = !state.config.debugAbnormals;
			},
			strictdef() {
				if (state.config.defendSuccessStrict)
					mod.command.message("DEFEND_SUCCESS_STRICT deactivated.");
				else
					mod.command.message("DEFEND_SUCCESS_STRICT activated.");

				state.config.defendSuccessStrict = !state.config.defendSuccessStrict;
			},
			off() {
				if (state.config.enabled) {
					mod.command.message("Skill emulation Disabled.");
					state.SwitchEnableStateWithEvent();
				} else {
					mod.command.message("Skill emulation already Disabled.");
				}
			},
			on() {
				if (!state.config.enabled) {
					state.SwitchEnableStateWithEvent();
					mod.command.message("Skill emulation Enabled.");
				} else {
					mod.command.message("Skill emulation already Enabled");
				}
			},
			jittercomp() {
				if (state.config.jitterCompensation) {
					mod.command.message("jitterCompensation Disabled.");
				} else {
					mod.command.message("jitterCompensation Enabled");
				}
				state.config.jitterCompensation = !state.config.jitterCompensation;
			},
			ping: {
				log() {
					mod.command.message("Ping history:");
					for (let entry of ping.history)
						mod.command.message(`${entry}`);
				},
				$default() {
					mod.command.message(`Ping: Min=${ping.min} Avg=${Math.floor(ping.avg)} Max=${ping.max} Variance=${ping.max - ping.min} Samples=${ping.history.length}`);
				},
			},
			$default() {
				mod.command.message("Invalid command.");
			},
		}, this);
	}
}
let map = new WeakMap();

module.exports = function Require(mod) {
	if (map.has(mod)) return map.get(mod);

	let cmd = new Cmds(mod);
	map.set(mod, cmd);
	return cmd;
};
