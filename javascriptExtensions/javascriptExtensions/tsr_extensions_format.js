function formatName(name) {
  const splitName = name.split(' ');
  const firstName = splitName.shift();
  const lastName = splitName.join(' ');
  const formattedFirstName = firstName[0] + '.';

  return [formattedFirstName, lastName].join(' ');
}

///////////////////////////////////////////////////////////////////////////

function formatIRating(iRating) {
  return (iRating / 1000).toFixed(1) + 'K';
}

///////////////////////////////////////////////////////////////////////////

function formatOverallDriverIndex(overallDriverIndex) {
  return padStartTwoCharacters(overallDriverIndex);
}

///////////////////////////////////////////////////////////////////////////

function formatClassDriverIndex(classDriverIndex) {
  return padStartTwoCharacters(classDriverIndex);
}

///////////////////////////////////////////////////////////////////////////

function formatRelativeDriverIndex(relativeDriverIndex) {
  return {
    relativeDriverDirection: relativeDriverIndex > 0 ? 'Ahead' : 'Behind',
    relativeDriverNumber: Math.abs(relativeDriverIndex),
  };
}

///////////////////////////////////////////////////////////////////////////

function formatDelta(relative) {
  const relativeSign = relative > 0 ? '+' : '';
  const relativeString = JSON.stringify(relative);

  const [integer, decimal] = relativeString.split('.');
  const trimmedDecimal = decimal ? decimal.slice(0, 3) : '';
  const paddedDecimal = trimmedDecimal.padEnd(3, '0');

  return relativeSign + [integer, paddedDecimal].join('.');
}

///////////////////////////////////////////////////////////////////////////

function tsrFormatNumberTwoCharacters(number) {
  return Math.abs(number) < 10 ? number.toFixed(1) : number.toFixed(0);
}

function padStartTwoCharacters(number) {
  return String(number).padStart(2, '0');
}

///////////////////////////////////////////////////////////////////////////

function formatSectorDelta(sectorIndex) {
  const { sectorDeltas } = tsrGetPlayerData();
  const sectorDeltaInSeconds = timespantoseconds(sectorDeltas[sectorIndex - 1]);

  return sectorDeltaInSeconds > 0 ? '+' + sectorDeltaInSeconds.toFixed(3) : sectorDeltaInSeconds.toFixed(3);
}
