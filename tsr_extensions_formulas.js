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
  switch (color) {
    case '#FFffda59': //Class 1
      return tsrGetTheme().color.red; //Red
    case '#FF33ceff': //Class 2
      return tsrGetTheme().color.blue; //Blue
    case '#FFff5888': //Class 3
      return tsrGetTheme().color.green; //Green
    case '#FFae6bff': //Class 4
      return tsrGetTheme().color.orange; //Orange
    case '#FF53ff77': //Class 5
      return tsrGetTheme().color.purple; //Purple
    default:
      return '#000000';
  }
}

///////////////////////////////////////////////////////////////////////////

function getLicense(fullLicense) {
  const [license, rating] = fullLicense.split(' ');
  return license;
}

function getLicenseColor(license) {
  switch (license) {
    case 'A': //Class 1
      return tsrGetTheme().color.blue; //Blue
    case 'B': //Class 2
      return tsrGetTheme().color.green; //Green
    case 'C': //Class 3
      return tsrGetTheme().color.yellow; //Yellow
    case 'D': //Class 4
      return tsrGetTheme().color.orange; //Orange
    case 'R': //Class 5
      return tsrGetTheme().color.red; //Red
    default:
      return '#000000';
  }
}

///////////////////////////////////////////////////////////////////////////

function getLastLapColor(lastLap, bestLap, sessionBestLap) {
  if (lastLap === 0) {
    return tsrGetTheme().color.accent;
  } else if (lastLap <= sessionBestLap) {
    return tsrGetTheme().color.purple;
  } else if (lastLap <= bestLap) {
    return tsrGetTheme().color.green;
  } else {
    return tsrGetTheme().color.white;
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
  if (bestLap === 0) {
    return tsrGetTheme().color.accent;
  } else if (bestLap <= sessionBestLap) {
    return tsrGetTheme().color.purple;
  } else {
    return tsrGetTheme().color.white;
  }
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
  const playerBest = timespantoseconds(tsrGetPlayerData().bestLap);
  const playerDelta = tsrGetPlayerData().delta;

  return playerBest > 0 ? secondstotimespan(playerBest + playerDelta) : '0:00.000';
}

function getPlayerPredictedLapColor() {
  const predicted = getPlayerPredictedLap();
  const personalBest = tsrGetPlayerData().bestLap;
  const sessionBest = tsrGetSessionData().info.bestLap;

  if (timespantoseconds(personalBest) === 0) {
    return tsrGetTheme().color.accent;
  } else if (predicted <= sessionBest) {
    return tsrGetTheme().color.purple;
  } else if (predicted <= personalBest) {
    return tsrGetTheme().color.green;
  } else {
    return tsrGetTheme().color.yellow;
  }
}

///////////////////////////////////////////////////////////////////////////

function getFormattedRelativeGap(relativeDriverIndex) {
  const relativeGap = tsrGetRelativeOpponentData(relativeDriverIndex).relativeGap;
  const prefix = relativeDriverIndex > 0 ? '' : '+';

  return relativeGap != null ? prefix + tsrFormatNumberTwoCharacters(relativeGap) : '-.-';
}

///////////////////////////////////////////////////////////////////////////

function getFormattedDelta() {
  const delta = tsrGetPlayerData().delta;
  return formatDelta(delta);
}

function getDeltaColor() {
  const delta = tsrGetPlayerData().delta;
  return delta < 0 ? tsrGetTheme().color.green : tsrGetTheme().color.red;
}

///////////////////////////////////////////////////////////////////////////

function getLapDifferenceColor(relativeDriverIndex) {
  const lapDifference = tsrGetRelativeOpponentData(relativeDriverIndex).lapDifference;

  if (lapDifference >= 0.8) {
    return tsrGetTheme().color.blue;
  } else if (lapDifference <= -0.8) {
    return tsrGetTheme().color.red;
  } else {
    return tsrGetTheme().color.white;
  }
}

///////////////////////////////////////////////////////////////////////////

function opponentIsHidden(relativeDriverIndex) {
  const nameLength = tsrGetRelativeOpponentData(relativeDriverIndex).name.length;

  return nameLength > 0;
}

///////////////////////////////////////////////////////////////////////////

function tsrGetLapCounter() {
  const isTimedSession = tsrGetSessionData().info.totalLaps < 32767;
  const totalLaps = isTimedSession
    ? tsrGetSessionData().info.totalLaps
    : tsrGetSessionData().info.estLapsRemaining + tsrGetPlayerData().currentLap;

  return getFormattedCurrentLap() + '/' + totalLaps;
}

///////////////////////////////////////////////////////////////////////////

function isFixedLapRace() {
  return tsrGetSessionData().info.totalLaps < 32767;
}

///////////////////////////////////////////////////////////////////////////

function getFormattedFuelRemaining() {
  const fuel = tsrGetCarData().status.fuelRemaining;

  return tsrFormatNumberTwoCharacters(fuel);
}

function getFormattedFuelLapsRemaining() {
  const lapsRemaining = tsrGetCarData().status.fuelRemainingLaps;

  return tsrFormatNumberTwoCharacters(lapsRemaining);
}

function getFormattedRefuel() {
  const refuel = tsrGetCarData().status.refuel;

  return refuel > 0 ? tsrFormatNumberTwoCharacters(refuel) : '-.-';
}

///////////////////////////////////////////////////////////////////////////

function getFormattedCurrentLap() {
  const currentLap = tsrGetPlayerData().currentLap;

  return padStartTwoCharacters(currentLap);
}

function getFormattedPosition() {
  const position = tsrGetPlayerData().position;

  return padStartTwoCharacters(position);
}

///////////////////////////////////////////////////////////////////////////

function tsrGetSectorDelta(sectorIndex) {
  return sectorIndex === tsrGetPlayerData().currentSectorIndex ? '-.---' : formatSectorDelta(sectorIndex);
}

function tsrGetSectorDeltaColor(sectorIndex) {
  if (sectorIndex === tsrGetPlayerData().currentSectorIndex) {
    return tsrGetTheme().color.accent;
  } else if (formatSectorDelta(sectorIndex) >= 0) {
    return tsrGetTheme().color.yellow;
  } else {
    return tsrGetTheme().color.green;
  }
}

function tsrGetSectorTime(sectorIndex) {
  return sectorIndex === tsrGetPlayerData().currentSectorIndex
    ? tsrGetPlayerData().currentSectorTime
    : tsrGetPlayerData().sectorLastTimes[repeatindex() - 1];
}

function tsrGetSectorTimeColor(sectorIndex) {
  if (tsrGetPlayerData().currentSectorIndex < sectorIndex) {
    return tsrGetTheme().color.accent;
  } else if (tsrGetPlayerData().currentSectorIndex === sectorIndex) {
    return tsrGetTheme().color.white;
  } else if (
    timespantoseconds(tsrGetPlayerData().sectorLastTimes[repeatindex() - 1]) ===
    timespantoseconds(tsrGetPlayerData().sectorBestTimes[repeatindex() - 1])
  ) {
    return tsrGetTheme().color.purple;
  } else {
    return tsrGetTheme().color.white;
  }
}

///////////////////////////////////////////////////////////////////////////

function tsrGetSessionType() {
  if (tsrGetSessionData().info.sessionType.includes('Practice')) {
    return 'practice';
  } else if (tsrGetSessionData().info.sessionType.includes('Qual')) {
    return 'qualify';
  } else if (tsrGetSessionData().info.sessionType.includes('Race')) {
    return 'race';
  } else {
    return 'testing';
  }
}

function getCenterModuleIndex() {
  const sessionType = tsrGetSessionType();

  if (sessionType === 'practice') {
    return 0;
  } else if (sessionType === 'qualify') {
    return 0;
  } else if (sessionType === 'race') {
    return 0;
  } else {
    return 0;
  }
}

function getLeftModuleIndex() {
  const sessionType = tsrGetSessionType();

  if (sessionType === 'practice') {
    return 0;
  } else if (sessionType === 'qualify') {
    return 0;
  } else if (sessionType === 'race') {
    return 2;
  } else {
    return 0;
  }
}

function getRightModuleIndex() {
  const sessionType = tsrGetSessionType();

  if (sessionType === 'practice') {
    return 1;
  } else if (sessionType === 'qualify') {
    return 1;
  } else if (sessionType === 'race') {
    return 1;
  } else {
    return 1;
  }
}

function getTopModuleIndex() {
  const sessionType = tsrGetSessionType();

  if (sessionType === 'practice') {
    return 0;
  } else if (sessionType === 'qualify') {
    return 0;
  } else if (sessionType === 'race') {
    return 0;
  } else {
    return 0;
  }
}

///////////////////////////////////////////////////////////////////////////
