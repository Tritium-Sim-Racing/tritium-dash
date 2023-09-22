//
// Ben's In-Car Dash - Common.js
// Author: benofficial2
// Date: 2023/09/10
//
// If this code was helpful to you, please consider following me on Twitch
// http://twitch.tv/benofficial2
//
function isGameIRacing() {
  return $prop('DataCorePlugin.CurrentGame') == 'IRacing';
}

function isReplayPlaying() {
  if (isGameIRacing()) {
    return $prop('DataCorePlugin.GameRawData.Telemetry.IsReplayPlaying');
  }
  return false;
}

function isInPitLane() {
  return $prop('DataCorePlugin.GameData.IsInPitLane');
}

function isGameRunning() {
  return $prop('DataCorePlugin.GameRunning');
}

function isDriving() {
  return isGameRunning() && !isReplayPlaying();
}

function isRace() {
  var sessionTypeName = $prop('DataCorePlugin.GameData.SessionTypeName');
  return String(sessionTypeName).indexOf('Race') != -1;
}

function isQual() {
  var sessionTypeName = $prop('DataCorePlugin.GameData.SessionTypeName');
  return String(sessionTypeName).indexOf('Qual') != -1;
}

function isPractice() {
  var sessionTypeName = $prop('DataCorePlugin.GameData.SessionTypeName');
  return (
    String(sessionTypeName).indexOf('Practice') != -1 ||
    String(sessionTypeName).indexOf('Warmup') != -1 ||
    String(sessionTypeName).indexOf('Testing') != -1
  );
}

function isOffline() {
  var sessionTypeName = $prop('DataCorePlugin.GameData.SessionTypeName');
  return String(sessionTypeName).indexOf('Offline') != -1;
}

// Returns True if the specified flag is out.
// Supported colors: 'Black', 'Blue', 'Checkered', 'Green', 'Orange', 'White', 'Yellow'.
function isFlagOut(color) {
  var flagOut = $prop('DataCorePlugin.GameData.Flag_' + color);
  return flagOut != 0;
}

function shouldPitThisLap() {
  var fuelRemainingLaps = $prop('DataCorePlugin.Computed.Fuel_RemainingLaps');
  var trackPercentRemaining = 1 - $prop('DataCorePlugin.GameData.TrackPositionPercent');
  var fuelAlertLaps = $prop('DataCorePlugin.GameData.CarSettings_FuelAlertLaps');
  return fuelRemainingLaps - trackPercentRemaining < fuelAlertLaps;
}

//
// Returns an object with properties related to the car's Push To Pass status (aka OT).
//
// Notes:
// This function shouldn't be called directly in each property that need it.
// Instead, create a Dashboard Variable with only this code:
//    return generateP2pStatus();
//
// This will ensure that each value is updated once per frame in lock-step.
//
// Example on how to use in a dashboard property:
//    const p2p = $prop('variable.p2pStatus');
//    return p2p.activated;
//
function generateP2pStatus() {
  var p2p = {
    activated: false,
    count: 0,
    timeLeft: 0,
    cooldown: 0,
  };

  const carId = $prop('DataCorePlugin.GameData.CarId');
  if (carId == 'dallarair18') {
    // For the IndyCar, the values are directly exposed in telemetry.
    const gamePushToPassActive = $prop('IRacingExtraProperties.iRacing_PushToPassActive');
    const gamePushToPassCount = $prop('IRacingExtraProperties.iRacing_PushToPassCount');
    p2p.activated = gamePushToPassActive;
    p2p.count = gamePushToPassCount;
  } else if (carId == 'superformulasf23 toyota') {
    // For the Super Formula, we only have PushToPass which is true while holding the button.
    // Based on this input, we have to re-implement the car's P2P logic here.
    const gamePushToPass = $prop('DataCorePlugin.GameRawData.Telemetry.PushToPass');

    // Total P2P time in milliseconds
    const p2pTotalTime = 200 * 1000;

    // Total cooldown time in milliseconds.
    // Adding 1 second to help prevent a de-sync if trying to re-activate immediately.
    // But mashing the button while in cooldown will definitely result in a de-sync. Don't mash.
    const p2pTotalCooldown = (100 + 1) * 1000;

    // Initialize persistent variables.
    if (root['button'] == null) {
      root['button'] = false;
    }
    if (root['activated'] == null) {
      root['activated'] = false;
    }
    if (root['timeLeft'] == null) {
      root['timeLeft'] = p2pTotalTime;
    }
    if (root['hadGreenFlag'] == null) {
      root['hadGreenFlag'] = false;
    }

    // Reset state when in replay so we always start with a good state.
    const isReplayPlaying = $prop('DataCorePlugin.GameRawData.Telemetry.IsReplayPlaying');
    if (isReplayPlaying) {
      root['button'] = false;
      root['activated'] = false;
      root['activatedTime'] = null;
      root['deactivatedTime'] = null;
    }

    // Reset the per-race state when not in a race anymore.
    if (!isRace()) {
      root['timeLeft'] = p2pTotalTime;
      root['hadGreenFlag'] = false;
    }

    // Remember if we had the green flag in a race.
    if (isRace() && !root['hadGreenFlag']) {
      root['hadGreenFlag'] = isFlagOut('Green');
    }

    // Toggle the state every time we press the button.
    // Will de-sync if P2P doesn't get activated (e.g. can happen in pit)
    if (gamePushToPass == true && root['button'] == false) {
      if (root['activated'] == false) {
        const speed = $prop('DataCorePlugin.GameData.SpeedKmh');

        // Cannot activate once timer is depleted.
        // Cannot activate in qualifying.
        // Cannot activate in a race when cooldown is active.
        // Cannot activate before green flag in a race.
        // Cannot activate when stopped in the pit.
        const canActivate =
          root['timeLeft'] > 0 &&
          !isQual() &&
          (!isRace() || root['deactivatedTime'] == null) &&
          (!isRace() || root['hadGreenFlag'] == true) &&
          (!isInPitLane() || speed > 1);

        if (canActivate) {
          // Manually activated P2P
          root['activated'] = true;
          root['activatedTime'] = Date.now();
        }
      } else {
        // Manually deactivated P2P
        root['activated'] = false;
        const activatedDuration = Date.now() - root['activatedTime'];
        root['activatedTime'] = null;
        root['deactivatedTime'] = Date.now();

        if (activatedDuration >= root['timeLeft']) {
          root['timeLeft'] = 0;
        } else {
          root['timeLeft'] = root['timeLeft'] - activatedDuration;
        }
      }
    }

    // In a race, update the timers
    if (isRace()) {
      if (root['activated'] == true) {
        // Update the timeLeft timer.
        const activatedDuration = Date.now() - root['activatedTime'];
        if (activatedDuration < root['timeLeft']) {
          p2p.timeLeft = root['timeLeft'] - activatedDuration;
        } else {
          // Out of time: automatically deactivate
          root['activated'] = false;
          root['timeLeft'] = 0;
          root['activatedTime'] = null;
        }
      } else {
        // Update the cooldown timer.
        p2p.timeLeft = root['timeLeft'];
        const deactivatedDuration = Date.now() - root['deactivatedTime'];
        if (deactivatedDuration < p2pTotalCooldown) {
          p2p.cooldown = p2pTotalCooldown - deactivatedDuration;
        } else {
          // Cooldown completed.
          p2p.cooldown = 0;
          root['deactivatedTime'] = null;
        }
      }
    } else if (isPractice()) {
      // In practice, display the same time left value as on the steering wheel.
      // It does not decrement while in use.
      p2p.timeLeft = 999 * 1000;
    }

    // Remember last button state to toggle only once.
    root['button'] = gamePushToPass;

    p2p.activated = root['activated'];
  }

  return p2p;
}

// Used for the small top green box.
function carHasPushToPass() {
  const carId = $prop('DataCorePlugin.GameData.CarId');
  return carId == 'dallarair18' || carId == 'superformulasf23 toyota';
}

// Used for the upper green box.
function carHasPushToPassCount() {
  const carId = $prop('DataCorePlugin.GameData.CarId');
  return carId == 'dallarair18';
}

// Used for the upper green box.
function carHasPushToPassTimer() {
  const carId = $prop('DataCorePlugin.GameData.CarId');
  return carId == 'superformulasf23 toyota';
}

// Used for the small top green box.
function carHasPushToPassCooldown() {
  const carId = $prop('DataCorePlugin.GameData.CarId');
  return carId == 'superformulasf23 toyota';
}
