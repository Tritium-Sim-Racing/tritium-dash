///////////////////////////////////////////////////////////////////////////

function modifyHexOpacity(hexColor, newOpacity) {
  // if hex color isn't properly formatted, return an error message
  if (hexColor.length !== 9 && hexColor.length !== 7) {
    return 'Error: incorrect formatting for hex color';
  }

  // convert the new opacity to hex
  const hexOpacity = Math.floor(newOpacity * 255)
    .toString(16)
    .padStart(2, '0');

  // if the hex color has an opacity, slice it and the '#' off
  // if not, just slice off the '#'
  const trimmedHexColor = hexColor.length === 9 ? hexColor.slice(3) : hexColor.slice(1);

  // return the color with the new opacity
  return '#' + hexOpacity + trimmedHexColor;
}

///////////////////////////////////////////////////////////////////////////

function swapClassColors(color) {
  const { red, blue, green, orange, purple } = tsrGetTheme().color;

  switch (color) {
    case '#FFffda59': //Class 1
      return red;
    case '#FF33ceff': //Class 2
      return blue;
    case '#FFff5888': //Class 3
      return green;
    case '#FFae6bff': //Class 4
      return orange;
    case '#FF53ff77': //Class 5
      return purple;
    default:
      return '#000000';
  }
}

///////////////////////////////////////////////////////////////////////////

function getLicense(fullLicense) {
  const [license] = fullLicense.split(' ');

  return license;
}

function getLicenseColor(license) {
  const { blue, green, yellow, orange, red } = tsrGetTheme().color;

  switch (license) {
    case 'A': //Class 1
      return blue;
    case 'B': //Class 2
      return green;
    case 'C': //Class 3
      return yellow;
    case 'D': //Class 4
      return orange;
    case 'R': //Class 5
      return red;
    default:
      return '#000000';
  }
}

///////////////////////////////////////////////////////////////////////////

function getLastLapColor(lastLap, bestLap, sessionBestLap) {
  const { accent, purple, green, white } = tsrGetTheme().color;

  if (lastLap === 0) {
    return accent;
  }

  if (lastLap <= sessionBestLap) {
    return purple;
  } else if (lastLap <= bestLap) {
    return green;
  } else {
    return white;
  }
}

function getOpponentLastLapColor(relativeDriverIndex) {
  const opponentLast = timespantoseconds(tsrGetRelativeOpponentData(relativeDriverIndex).lastLap);
  const opponentBest = timespantoseconds(tsrGetRelativeOpponentData(relativeDriverIndex).bestLap);
  const sessionBest = timespantoseconds(tsrGetSessionData().info.bestLap);

  return getLastLapColor(opponentLast, opponentBest, sessionBest);
}

function getPlayerLastLapColor() {
  const playerLast = timespantoseconds(tsrGetPlayerData().lastLap);
  const playerBest = timespantoseconds(tsrGetPlayerData().bestLap);
  const sessionBest = timespantoseconds(tsrGetSessionData().info.bestLap);

  return getLastLapColor(playerLast, playerBest, sessionBest);
}

///////////////////////////////////////////////////////////////////////////

function getBestLapColor(bestLap, sessionBestLap) {
  const { accent, purple, white } = tsrGetTheme().color;

  if (bestLap === 0) {
    return accent;
  }

  return bestLap <= sessionBestLap ? purple : white;
}

function getOpponentBestLapColor(relativeDriverIndex) {
  const opponentBest = timespantoseconds(tsrGetRelativeOpponentData(relativeDriverIndex).bestLap);
  const sessionBest = timespantoseconds(tsrGetSessionData().info.bestLap);

  return getBestLapColor(opponentBest, sessionBest);
}

function getPlayerBestLapColor() {
  const playerBest = timespantoseconds(tsrGetPlayerData().bestLap);
  const sessionBest = timespantoseconds(tsrGetSessionData().info.bestLap);

  return getBestLapColor(playerBest, sessionBest);
}

///////////////////////////////////////////////////////////////////////////

function getPlayerPredictedLap() {
  const { delta, bestLap } = tsrGetPlayerData();
  const bestLapInSeconds = timespantoseconds(bestLap);

  return bestLapInSeconds > 0 ? secondstotimespan(bestLapInSeconds + delta) : '0:00.000';
}

function getPlayerPredictedLapColor() {
  const { accent, purple, green, yellow } = tsrGetTheme().color;
  const predicted = getPlayerPredictedLap();
  const personalBest = tsrGetPlayerData().bestLap;
  const sessionBest = tsrGetSessionData().info.bestLap;

  if (timespantoseconds(personalBest) === 0) {
    return accent;
  }

  if (predicted <= sessionBest) {
    return purple;
  } else if (predicted <= personalBest) {
    return green;
  } else {
    return yellow;
  }
}

///////////////////////////////////////////////////////////////////////////

function getFormattedRelativeGap(relativeDriverIndex) {
  const { relativeGap } = tsrGetRelativeOpponentData(relativeDriverIndex);
  const prefix = relativeDriverIndex > 0 ? '' : '+';

  return relativeGap != null ? prefix + tsrFormatNumberTwoCharacters(relativeGap) : '-.-';
}

///////////////////////////////////////////////////////////////////////////

function getFormattedDelta() {
  const { delta } = tsrGetPlayerData();

  return formatDelta(delta);
}

function getDeltaColor() {
  const { red, green } = tsrGetTheme().color;
  const { delta } = tsrGetPlayerData();

  return delta >= 0 ? red : green;
}

///////////////////////////////////////////////////////////////////////////

function getLapDifferenceColor(relativeDriverIndex) {
  const { lapDifference } = tsrGetRelativeOpponentData(relativeDriverIndex);
  const { blue, red, white } = tsrGetTheme().color;

  if (lapDifference >= 0.8) {
    return blue;
  } else if (lapDifference <= -0.8) {
    return red;
  } else {
    return white;
  }
}

///////////////////////////////////////////////////////////////////////////

function opponentIsHidden(relativeDriverIndex) {
  const { name } = tsrGetRelativeOpponentData(relativeDriverIndex);

  return name.length > 0;
}

///////////////////////////////////////////////////////////////////////////

function tsrGetLapCounter() {
  const { totalLaps, estLapsRemaining } = tsrGetSessionData().info;
  const { currentLap } = tsrGetPlayerData();

  const totalLapCount = isFixedLapRace() ? totalLaps : estLapsRemaining + currentLap;

  return getFormattedCurrentLap() + '/' + totalLapCount;
}

///////////////////////////////////////////////////////////////////////////

function isFixedLapRace() {
  return tsrGetSessionData().info.totalLaps < 32767;
}

///////////////////////////////////////////////////////////////////////////

function getFormattedFuelRemaining() {
  const { fuelRemaining } = tsrGetCarData().status;

  return tsrFormatNumberTwoCharacters(fuelRemaining);
}

function getFormattedFuelLapsRemaining() {
  const { fuelRemainingLaps } = tsrGetCarData().status;

  return tsrFormatNumberTwoCharacters(fuelRemainingLaps);
}

function getFormattedRefuel() {
  const { refuel } = tsrGetCarData().status;

  return refuel > 0 ? tsrFormatNumberTwoCharacters(refuel) : '-.-';
}

///////////////////////////////////////////////////////////////////////////

function getFormattedCurrentLap() {
  const { currentLap } = tsrGetPlayerData();

  return padStartTwoCharacters(currentLap);
}

function getFormattedPosition() {
  const { position } = tsrGetPlayerData();

  return padStartTwoCharacters(position);
}

///////////////////////////////////////////////////////////////////////////

function tsrGetSectorDelta(sectorIndex) {
  return sectorIndex === tsrGetPlayerData().currentSectorIndex ? '-.---' : formatSectorDelta(sectorIndex);
}

function tsrGetSectorDeltaColor(sectorIndex) {
  const { accent, yellow, green } = tsrGetTheme().color;

  if (sectorIndex === tsrGetPlayerData().currentSectorIndex) {
    return accent;
  } else if (formatSectorDelta(sectorIndex) >= 0) {
    return yellow;
  } else {
    return green;
  }
}

function tsrGetSectorTime(sectorIndex) {
  const { currentSectorIndex, currentSectorTime, sectorLastTimes } = tsrGetPlayerData();
  return sectorIndex === currentSectorIndex ? currentSectorTime : sectorLastTimes[repeatindex() - 1];
}

function tsrGetSectorTimeColor(sectorIndex) {
  const { accent, white, purple } = tsrGetTheme().color;
  const { currentSectorIndex, sectorBestTimes, sectorLastTimes } = tsrGetPlayerData();

  if (currentSectorIndex < sectorIndex) {
    return accent;
  } else if (currentSectorIndex === sectorIndex) {
    return white;
  } else if (timespantoseconds(sectorLastTimes[repeatindex() - 1]) === timespantoseconds(sectorBestTimes[repeatindex() - 1])) {
    return purple;
  } else {
    return white;
  }
}

///////////////////////////////////////////////////////////////////////////

function tsrGetSessionType() {
  const { sessionType } = tsrGetSessionData().info;

  if (sessionType.includes('Practice')) {
    return 'practice';
  } else if (sessionType.includes('Qual')) {
    return 'qualify';
  } else if (sessionType.includes('Race')) {
    return 'race';
  } else {
    return 'testing';
  }
}

function getCenterModuleIndex() {
  const sessionType = tsrGetSessionType();

  const map = {
    practice: 0,
    qualify: 0,
    race: 0,
  };

  return map[sessionType] ?? 0;
}

function getLeftModuleIndex() {
  const sessionType = tsrGetSessionType();

  const map = {
    practice: 0,
    qualify: 0,
    race: 2,
  };

  return map[sessionType] ?? 0;
}

function getRightModuleIndex() {
  const sessionType = tsrGetSessionType();

  const map = {
    practice: 1,
    qualify: 1,
    race: 1,
  };

  return map[sessionType] ?? 1;
}

function getTopModuleIndex() {
  const sessionType = tsrGetSessionType();

  const map = {
    practice: 0,
    qualify: 0,
    race: 0,
  };

  return map[sessionType] ?? 0;
}

///////////////////////////////////////////////////////////////////////////

function tsrGetMainScreenLayout() {
  const { arbFront, arbRear } = tsrGetCarData().settings;
  const { isRunning } = tsrGetGameData();

  return arbFront != null && arbRear != null && isRunning === 1;
}

///////////////////////////////////////////////////////////////////////////

function tsrGetWindValue() {
  const { windDirection } = tsrGetSessionData().info;
  const { windVelocity } = tsrGetSessionData().info;

  return windVelocity.toFixed(1) + windDirection;
}

function tsrGetTrackUsage() {
  const { trackUsage } = tsrGetSessionData().info;
  const usageMap = {
    clean: '0%',
    'slight usage': '12%',
    'low usage': '25%',
    'moderately low usage': '37%',
    'moderate usage': '50%',
    'moderately high usage': '62%',
    'high usage': '75%',
    'extensive usage': '87%',
    'maximum usage': '99%',
  };
  return usageMap[trackUsage];
}

///////////////////////////////////////////////////////////////////////////

//Center Module Overlays

function tsrGetOvertakeStatus() {
  const p2p = $prop('variable.p2pStatus');
  const p2pActive = p2p.activated;
  const redlineReached = tsrGetCarData().status.redlineReached;

  if (redlineReached === 0) {
    return p2pActive;
  } else {
    return 0;
  }
}

function tsrGetLaunchControlStatus() {
  const { carId } = tsrGetCarData().info;
  const { revLimiter } = tsrGetCarData().settings;

  return carId === 'superformulasf23 toyota' && revLimiter < 9325;
}

function tsrGetRedlineStatus() {
  const { carId } = tsrGetCarData().info;
  const { revLimiter } = tsrGetCarData().settings;
  const { redlineReached } = tsrGetCarData().status;

  if (carId === 'superformulasf23 toyota') {
    return revLimiter < 9325 ? 0 : redlineReached;
  } else {
    return redlineReached;
  }
}

///////////////////////////////////////////////////////////////////////////

//Center Module Gauges

function tsrGetCenterModuleLeftGaugeValue() {
  const { brake } = tsrGetCarData().telemetry;
  const { clutch } = tsrGetCarData().telemetry;

  if (clutch > 0) {
    return clutch;
  } else {
    return brake;
  }
}

function tsrGetCenterModuleLeftGaugeColor() {
  const { clutch } = tsrGetCarData().telemetry;
  const { red, yellow } = tsrGetTheme().color;

  if (clutch > 0) {
    return yellow;
  } else {
    return red;
  }
}

function tsrGetCenterModuleRightGaugeValue() {
  const { throttle } = tsrGetCarData().telemetry;
  const { clutch } = tsrGetCarData().telemetry;

  if (clutch > 0) {
    return clutch;
  } else {
    return throttle;
  }
}

function tsrGetCenterModuleRightGaugeColor() {
  const { clutch } = tsrGetCarData().telemetry;
  const { green, yellow } = tsrGetTheme().color;

  if (clutch > 0) {
    return yellow;
  } else {
    return green;
  }
}

///////////////////////////////////////////////////////////////////////////

//Car Settings One

function tsrGetCarSettingOneValue() {
  const { mgukDeployMode } = tsrGetCarData().settings;
  const { carId } = tsrGetCarData().info;
  const p2p = $prop('variable.p2pStatus');
  const p2pActive = p2p.activated;
  const p2pCooldown = p2p.cooldown;
  const p2pTimeLeft = p2p.timeLeft;

  if (carId === 'superformulasf23 toyota') {
    if (p2pActive === true) {
      return 'ACT';
    } else if (p2pCooldown > 0) {
      return Math.floor(p2pCooldown / 1000);
    } else {
      return Math.floor(p2pTimeLeft / 1000);
    }
  }

  if (mgukDeployMode != null) {
    return getMgukDeployModeValue(mgukDeployMode);
  }

  return '---';
}

function tsrGetCarSettingOneLabel() {
  const { mgukDeployMode } = tsrGetCarData().settings;
  const { carId } = tsrGetCarData().info;

  if (carId === 'superformulasf23 toyota') {
    return 'OT';
  }

  if (mgukDeployMode != null) {
    return 'MGU-K';
  }

  return 'N/A';
}

function getMgukDeployModeValue(mgukDeployMode) {
  switch (mgukDeployMode) {
    case 0:
      return 'OFF';
    case 1:
      return 'QLY';
    case 2:
      return 'ATK';
    case 3:
      return 'BAL';
    default:
      return 'BLD';
  }
}

///////////////////////////////////////////////////////////////////////////

//Car Settings Two

function tsrGetCarSettingTwoValue() {
  const { carId } = tsrGetCarData().info;
  const { tc1, revLimiter } = tsrGetCarData().settings;

  if (carId === 'superformulasf23 toyota') {
    return revLimiter < 9325 ? 'ACT' : tc1;
  }

  if (tc1 != null) {
    return tc1;
  }

  return '---';
}

function tsrGetCarSettingTwoLabel() {
  const { carId } = tsrGetCarData().info;
  const { tc1 } = tsrGetCarData().settings;

  if (carId === 'superformulasf23 toyota') {
    return 'LC';
  }

  if (tc1 != null) {
    return 'TC-1';
  }

  return 'N/A';
}

///////////////////////////////////////////////////////////////////////////

//Car Settings Three

function tsrGetCarSettingThreeValue() {
  const { throttleShape, fuelMixture, tc2 } = tsrGetCarData().settings;

  if (throttleShape != null) {
    return throttleShape;
  }

  if (fuelMixture != null) {
    return fuelMixture;
  }

  if (tc2 != null) {
    return tc2;
  }

  return '---';
}

function tsrGetCarSettingThreeLabel() {
  const { throttleShape, fuelMixture, tc2 } = tsrGetCarData().settings;

  if (throttleShape != null) {
    return 'THR';
  }

  if (fuelMixture != null) {
    return 'MAP';
  }

  if (tc2 != null) {
    return 'TC-2';
  }

  return 'N/A';
}

///////////////////////////////////////////////////////////////////////////

//Car Settings Four

function tsrGetCarSettingFourValue() {
  const { brakeBias } = tsrGetCarData().settings;

  return brakeBias.toFixed(1);
}

function tsrGetCarSettingFourLabel() {
  const { brakeBias } = tsrGetCarData().settings;
  if (brakeBias != null) {
    return 'BIAS';
  }

  return '---';
}

///////////////////////////////////////////////////////////////////////////

//Car Settings Five

function tsrGetCarSettingFiveValue() {
  const { arbFront, arbRear } = tsrGetCarData().settings;

  if (arbFront != null && arbRear != null) {
    return arbFront + '-' + arbRear;
  }
  return '---';
}

function tsrGetCarSettingFiveLabel() {
  const { arbFront, arbRear } = tsrGetCarData().settings;

  if (arbFront != null && arbRear != null) {
    return 'ARB';
  }
  return 'N/A';
}

///////////////////////////////////////////////////////////////////////////

//Outer Gauge Left

function tsrGetOuterLeftGaugeValue() {
  const { carId } = tsrGetCarData().info;
  const { mgukBatteryPercent } = tsrGetCarData().status;
  const { mgukDeployMode } = tsrGetCarData().settings;
  const p2p = $prop('variable.p2pStatus');
  const p2pTimeLeft = p2p.timeLeft;

  if (carId === 'superformulasf23 toyota') {
    return p2pTimeLeft / 2000;
  }

  if (mgukDeployMode != null) {
    return mgukBatteryPercent * 100;
  }

  return 0;
}

function tsrGetOuterLeftGaugeIcon() {
  const { carId } = tsrGetCarData().info;
  const { mgukDeployMode } = tsrGetCarData().settings;

  if (carId === 'superformulasf23 toyota') {
    return 'SF23 OT';
  }

  if (mgukDeployMode != null) {
    return 'Battery';
  }
}
