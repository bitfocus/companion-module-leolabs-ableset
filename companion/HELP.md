## AbleSet

This module allows you to control AbleSet from Companion. It's compatible with
AbleSet 3, but most features will also work with AbleSet 2.

If you run Companion on the same machine as AbleSet, you don't have to configure anything.

If AbleSet is running on a different machine, set the `Server Hosts/IPs` field to the IP address of the AbleSet machine.
You can provide multiple hosts separated by commas for a redundant setup.

Check out the available button presets to find out what you can do with this module.

If you have any questions or feedback, feel free to post on the [AbleSet Forum](https://forum.ableset.app/c/support/9).

### Breaking Changes

#### 1.8.0

- AbleSet 3 doesn't offer the "Auto-Loop the Current Section" setting anymore,
  so it's been removed in the Companion module as well. There's no replacement.
- `playAudio12Connected` and `playAudio12Scene` have been renamed to
  `audioInterfaceConnected` and `audioInterfaceScene`. The old variables still
  work, but are considered deprecated.
