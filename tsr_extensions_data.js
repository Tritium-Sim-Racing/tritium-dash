/**swap
 * Tritium Sim Racing JavaScript Extensions
 * Please drop this file in the 'Simhub/JavascriptExtensions' folder
 */

/**
 * TODO:
 * [X] change variable names in useOpponentRelativePosition and dependent functions
 * [X] rewrite the primary functions into two separate functions, the tsr and non tsr variants
 * [X] add more helper functions to reduce bloat in primary functions
 */

///////////////////////////////////////////////////////////////////////////

function tsrGetPlayerData() {
  return {
    name: $prop('PlayerName'),
    shortName: 'N/A',
    initials: $prop('IRacingExtraProperties.iRacing_Player_Initials'),
    position: $prop('Position'),
    carNumber: $prop('IRacingExtraProperties.iRacing_Player_CarNumber'),
    classColor: $prop('IRacingExtraProperties.iRacing_Player_ClassColor'),
    iRating: $prop('IRacingExtraProperties.iRacing_Player_iRating'),
    safetyRating: $prop('IRacingExtraProperties.iRacing_Player_SafetyRating'),
    bestLap: $prop('BestLapTime'),
    lastLap: $prop('LastLapTime'),
    gapToLeader: $prop('IRacingExtraProperties.iRacing_Player_RelativeGapToLeader'),
    delta: $prop('DeltaToSessionBest'),
    currentLap: $prop('CurrentLap'),
    currentLapTime: $prop('CurrentLapTime'),
    sectorBestTimes: [...Array($prop('IRacingExtraProperties.Sector_Count')).keys()].map((sectorNumber) =>
      $prop(`IRacingExtraProperties.Sector_${String(sectorNumber + 1).padStart(2, '0')}_BestTime`)
    ),
    sectorLastTimes: [...Array($prop('IRacingExtraProperties.Sector_Count')).keys()].map((sectorNumber) =>
      $prop(`IRacingExtraProperties.Sector_${String(sectorNumber + 1).padStart(2, '0')}_LastTime`)
    ),
    sectorDeltas: [...Array($prop('IRacingExtraProperties.Sector_Count')).keys()].map((sectorNumber) =>
      $prop(`IRacingExtraProperties.Sector_${String(sectorNumber + 1).padStart(2, '0')}_DeltaLastToBest`)
    ),
    currentSectorIndex: $prop('IRacingExtraProperties.CurrentSector_Index'),
    currentSectorTime: $prop('IRacingExtraProperties.CurrentSector_Time'),
  };
}

///////////////////////////////////////////////////////////////////////////

function tsrGetRadarData(direction) {
  return {
    carRight: $prop('SpotterCarRight'),
    carLeft: $prop('SpotterCarLeft'),
  };
}

///////////////////////////////////////////////////////////////////////////

function tsrGetRelativeOpponentData(relativeDriverIndex) {
  const { relativeDriverDirection, relativeDriverNumber } = formatRelativeDriverIndex(relativeDriverIndex);
  return {
    name: $prop(`IRacingExtraProperties.iRacing_Driver${relativeDriverDirection}_0${relativeDriverNumber - 1}_Name`),
    shortName: $prop(`IRacingExtraProperties.iRacing_Driver${relativeDriverDirection}_0${relativeDriverNumber - 1}_AbbrevName`),
    initials: $prop(`IRacingExtraProperties.iRacing_Driver${relativeDriverDirection}_0${relativeDriverNumber - 1}_Initials`),
    position: $prop(`IRacingExtraProperties.iRacing_Driver${relativeDriverDirection}_0${relativeDriverNumber - 1}_Position`),
    carNumber: $prop(`IRacingExtraProperties.iRacing_Driver${relativeDriverDirection}_0${relativeDriverNumber - 1}_CarNumber`),
    classColor: $prop(`IRacingExtraProperties.iRacing_Driver${relativeDriverDirection}_0${relativeDriverNumber - 1}_ClassColor`),
    iRating: $prop(`IRacingExtraProperties.iRacing_Driver${relativeDriverDirection}_0${relativeDriverNumber - 1}_iRating`),
    safetyRating: $prop(`IRacingExtraProperties.iRacing_Driver${relativeDriverDirection}_0${relativeDriverNumber - 1}_SafetyRating`),
    bestLap: $prop(`IRacingExtraProperties.iRacing_Driver${relativeDriverDirection}_0${relativeDriverNumber - 1}_BestLapTime`),
    lastLap: $prop(`IRacingExtraProperties.iRacing_Driver${relativeDriverDirection}_0${relativeDriverNumber - 1}_LastLapTime`),
    relativeGap: $prop(`DahlDesign.Car${relativeDriverDirection}0${relativeDriverNumber}RealRelative`),
    deltaLastLap: $prop(`IRacingExtraProperties.iRacing_Driver${relativeDriverDirection}_0${relativeDriverNumber - 1}_GapChangeLastLap`),
    lapDifference: $prop(`IRacingExtraProperties.iRacing_Driver${relativeDriverDirection}_0${relativeDriverNumber - 1}_LapDifference`),
  };
}

///////////////////////////////////////////////////////////////////////////

function tsrGetClassOpponentData(classDriverIndex) {
  const formattedClassDriverIndex = formatClassDriverIndex(classDriverIndex - 1);
  return {
    name: $prop(`IRacingExtraProperties.iRacing_ClassLeaderboard_Driver_${formattedClassDriverIndex}_Name`),
    shortName: $prop(`IRacingExtraProperties.iRacing_ClassLeaderboard_Driver_${formattedClassDriverIndex}_AbbrevName`),
    initials: $prop(`IRacingExtraProperties.iRacing_ClassLeaderboard_Driver_${formattedClassDriverIndex}_Initials`),
    position: $prop(`IRacingExtraProperties.iRacing_ClassLeaderboard_Driver_${formattedClassDriverIndex}_Position`),
    carNumber: $prop(`IRacingExtraProperties.iRacing_ClassLeaderboard_Driver_${formattedClassDriverIndex}_CarNumber`),
    classColor: $prop(`IRacingExtraProperties.iRacing_ClassLeaderboard_Driver_${formattedClassDriverIndex}_ClassColor`),
    iRating: $prop(`IRacingExtraProperties.iRacing_ClassLeaderboard_Driver_${formattedClassDriverIndex}_iRating`),
    safetyRating: $prop(`IRacingExtraProperties.iRacing_ClassLeaderboard_Driver_${formattedClassDriverIndex}_SafetyRating`),
    bestLap: $prop(`IRacingExtraProperties.iRacing_ClassLeaderboard_Driver_${formattedClassDriverIndex}_BestLapTime`),
    lastLap: $prop(`IRacingExtraProperties.iRacing_ClassLeaderboard_Driver_${formattedClassDriverIndex}_LastLapTime`),
    gapToLeader: $prop(`IRacingExtraProperties.iRacing_ClassLeaderboard_Driver_${formattedClassDriverIndex}_RelativeGapToLeader`),
  };
}

///////////////////////////////////////////////////////////////////////////

function tsrGetOverallOpponentData(overallDriverIndex) {
  const formattedOverallDriverIndex = formatOverallDriverIndex(overallDriverIndex - 1);

  return {
    name: $prop(`IRacingExtraProperties.iRacing_Leaderboard_Driver_${formattedOverallDriverIndex}_Name`),
    shortName: $prop(`IRacingExtraProperties.iRacing_Leaderboard_Driver_${formattedOverallDriverIndex}_AbbrevName`),
    initials: $prop(`IRacingExtraProperties.iRacing_Leaderboard_Driver_${formattedOverallDriverIndex}_Initials`),
    position: $prop(`IRacingExtraProperties.iRacing_Leaderboard_Driver_${formattedOverallDriverIndex}_Position`),
    carNumber: $prop(`IRacingExtraProperties.iRacing_Leaderboard_Driver_${formattedOverallDriverIndex}_CarNumber`),
    classColor: $prop(`IRacingExtraProperties.iRacing_Leaderboard_Driver_${formattedOverallDriverIndex}_ClassColor`),
    iRating: $prop(`IRacingExtraProperties.iRacing_Leaderboard_Driver_${formattedOverallDriverIndex}_iRating`),
    safetyRating: $prop(`IRacingExtraProperties.iRacing_Leaderboard_Driver_${formattedOverallDriverIndex}_SafetyRating`),
    bestLap: $prop(`IRacingExtraProperties.iRacing_Leaderboard_Driver_${formattedOverallDriverIndex}_BestLapTime`),
    lastLap: $prop(`IRacingExtraProperties.iRacing_Leaderboard_Driver_${formattedOverallDriverIndex}_LastLapTime`),
    gapToLeader: $prop(`IRacingExtraProperties.iRacing_Leaderboard_Driver_${formattedOverallDriverIndex}_RelativeGapToLeader`),
  };
}

///////////////////////////////////////////////////////////////////////////

function tsrGetSessionData() {
  return {
    info: {
      sessionType: $prop('SessionTypeName'),
      bestLap: $prop('IRacingExtraProperties.iRacing_Session_OverallBestLapTime'),
      totalLaps: $prop('GameRawData.Telemetry.SessionLapsTotal'),
      lapsRemaining: $prop('RemainingLaps'),
      estLapsRemaining: $prop('IRacingExtraProperties.iRacing_LapsRemaining'),
    },
    track: {
      totalSectors: $prop('IRacingExtraProperties.Sector_Count'),
    },
  };
}

function tsrGetCarData() {
  return {
    info: {
      carId: $prop('CarId'),
      carClass: $prop('CarClass'),
    },
    settings: {
      overtake: 'N/A',
      mgukDeployMode: $prop('GameRawData.Telemetry.dcMGUKDeployMode'),
      abs: $prop('ABSLevel'),
      brakeBias: $prop('BrakeBias'),
      throttleShape: $prop('DataCorePlugin.GameRawData.Telemetry.dcThrottleShape'),
      fuelMixture: $prop('DataCorePlugin.GameRawData.Telemetry.dcFuelMixture'),
      tc1: $prop('GameRawData.Telemetry.dcTractionControl'),
      tc2: $prop('GameRawData.Telemetry.dcTractionControl2'),
      arbFront: $prop('GameRawData.Telemetry.dcAntiRollFront'),
      arbRear: $prop('GameRawData.Telemetry.dcAntiRollRear'),
      revLimiter: $prop('CarSettings_MaxRPM'),
    },
    status: {
      fuelUnit: $prop('FuelUnit'),
      fuelRemaining: $prop('Fuel'),
      fuelRemainingLaps: $prop('DataCorePlugin.Computed.Fuel_RemainingLaps'),
      fuelRemainingTime: $prop('DataCorePlugin.Computed.Fuel_RemainingTime'),
      avgFuelConsumption: $prop('DataCorePlugin.Computed.Fuel_LitersPerLap'),
      refuel: $prop('IRacingExtraProperties.iRacing_FuelToAddPushing'),
      gear: $prop('DahlDesign.SmoothGear'),
      rpm: $prop('Rpms'),
      speed: $prop('SpeedLocal'),
      redlineReached: $prop('CarSettings_RPMRedLineReached'),
    },
  };
}
