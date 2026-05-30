const GROUPS = {
  A: {
    name: "Group A",
    teams: ["Mexico", "South Africa", "South Korea", "Czechia"],
    fixtures: [
      { home: "Mexico", away: "South Africa", date: "2026-06-11", time: "15:00 ET", venue: "Estadio Azteca, Mexico City" },
      { home: "South Korea", away: "Czechia", date: "2026-06-11", time: "22:00 ET", venue: "Estadio Akron, Zapopan" },
      { home: "Mexico", away: "Czechia", date: "2026-06-15", time: "18:00 ET", venue: "Estadio Azteca, Mexico City" },
      { home: "South Africa", away: "South Korea", date: "2026-06-15", time: "21:00 ET", venue: "Estadio BBVA, Monterrey" },
      { home: "Mexico", away: "South Korea", date: "2026-06-19", time: "TBD", venue: "Estadio Azteca, Mexico City" },
      { home: "Czechia", away: "South Africa", date: "2026-06-19", time: "TBD", venue: "Estadio Akron, Zapopan" }
    ]
  },
  B: {
    name: "Group B",
    teams: ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"],
    fixtures: [
      { home: "Canada", away: "Bosnia and Herzegovina", date: "2026-06-12", time: "TBD", venue: "BMO Field, Toronto" },
      { home: "Qatar", away: "Switzerland", date: "2026-06-12", time: "TBD", venue: "BC Place, Vancouver" },
      { home: "Canada", away: "Qatar", date: "2026-06-16", time: "TBD", venue: "BMO Field, Toronto" },
      { home: "Bosnia and Herzegovina", away: "Switzerland", date: "2026-06-16", time: "TBD", venue: "BC Place, Vancouver" },
      { home: "Canada", away: "Switzerland", date: "2026-06-20", time: "TBD", venue: "BMO Field, Toronto" },
      { home: "Bosnia and Herzegovina", away: "Qatar", date: "2026-06-20", time: "TBD", venue: "BC Place, Vancouver" }
    ]
  },
  C: {
    name: "Group C",
    teams: ["Brazil", "Morocco", "Haiti", "Scotland"],
    fixtures: [
      { home: "Brazil", away: "Morocco", date: "2026-06-13", time: "TBD", venue: "AT&T Stadium, Dallas" },
      { home: "Haiti", away: "Scotland", date: "2026-06-13", time: "TBD", venue: "Estadio Universitario, Monterrey" },
      { home: "Brazil", away: "Haiti", date: "2026-06-17", time: "TBD", venue: "SoFi Stadium, Los Angeles" },
      { home: "Morocco", away: "Scotland", date: "2026-06-17", time: "TBD", venue: "AT&T Stadium, Dallas" },
      { home: "Brazil", away: "Scotland", date: "2026-06-21", time: "TBD", venue: "MetLife Stadium, New York" },
      { home: "Morocco", away: "Haiti", date: "2026-06-21", time: "TBD", venue: "AT&T Stadium, Dallas" }
    ]
  },
  D: {
    name: "Group D",
    teams: ["United States", "Paraguay", "Australia", "Türkiye"],
    fixtures: [
      { home: "United States", away: "Paraguay", date: "2026-06-12", time: "15:00 ET", venue: "SoFi Stadium, Los Angeles" },
      { home: "Australia", away: "Türkiye", date: "2026-06-12", time: "TBD", venue: "Lumen Field, Seattle" },
      { home: "United States", away: "Australia", date: "2026-06-19", time: "TBD", venue: "Lumen Field, Seattle" },
      { home: "Paraguay", away: "Türkiye", date: "2026-06-19", time: "TBD", venue: "MetLife Stadium, New York" },
      { home: "United States", away: "Türkiye", date: "2026-06-25", time: "TBD", venue: "SoFi Stadium, Los Angeles" },
      { home: "Paraguay", away: "Australia", date: "2026-06-25", time: "TBD", venue: "Rose Bowl, Pasadena" }
    ]
  },
  E: {
    name: "Group E",
    teams: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"],
    fixtures: [
      { home: "Germany", away: "Curaçao", date: "2026-06-14", time: "TBD", venue: "Lincoln Financial Field, Philadelphia" },
      { home: "Ivory Coast", away: "Ecuador", date: "2026-06-14", time: "TBD", venue: "Hard Rock Stadium, Miami" },
      { home: "Germany", away: "Ivory Coast", date: "2026-06-18", time: "TBD", venue: "Lincoln Financial Field, Philadelphia" },
      { home: "Curaçao", away: "Ecuador", date: "2026-06-18", time: "TBD", venue: "Hard Rock Stadium, Miami" },
      { home: "Germany", away: "Ecuador", date: "2026-06-22", time: "TBD", venue: "Lincoln Financial Field, Philadelphia" },
      { home: "Curaçao", away: "Ivory Coast", date: "2026-06-22", time: "TBD", venue: "Hard Rock Stadium, Miami" }
    ]
  },
  F: {
    name: "Group F",
    teams: ["Netherlands", "Japan", "Sweden", "Tunisia"],
    fixtures: [
      { home: "Netherlands", away: "Japan", date: "2026-06-14", time: "TBD", venue: "Gillette Stadium, Boston" },
      { home: "Sweden", away: "Tunisia", date: "2026-06-14", time: "TBD", venue: "Bank of America Stadium, Charlotte" },
      { home: "Netherlands", away: "Sweden", date: "2026-06-18", time: "TBD", venue: "Gillette Stadium, Boston" },
      { home: "Japan", away: "Tunisia", date: "2026-06-18", time: "TBD", venue: "Bank of America Stadium, Charlotte" },
      { home: "Netherlands", away: "Tunisia", date: "2026-06-22", time: "TBD", venue: "Gillette Stadium, Boston" },
      { home: "Japan", away: "Sweden", date: "2026-06-22", time: "TBD", venue: "Bank of America Stadium, Charlotte" }
    ]
  },
  G: {
    name: "Group G",
    teams: ["Belgium", "Egypt", "Iran", "New Zealand"],
    fixtures: [
      { home: "Belgium", away: "Egypt", date: "2026-06-15", time: "TBD", venue: "AT&T Stadium, Dallas" },
      { home: "Iran", away: "New Zealand", date: "2026-06-15", time: "TBD", venue: "Arrowhead Stadium, Kansas City" },
      { home: "Belgium", away: "Iran", date: "2026-06-19", time: "TBD", venue: "AT&T Stadium, Dallas" },
      { home: "Egypt", away: "New Zealand", date: "2026-06-19", time: "TBD", venue: "Arrowhead Stadium, Kansas City" },
      { home: "Belgium", away: "New Zealand", date: "2026-06-23", time: "TBD", venue: "AT&T Stadium, Dallas" },
      { home: "Egypt", away: "Iran", date: "2026-06-23", time: "TBD", venue: "Arrowhead Stadium, Kansas City" }
    ]
  },
  H: {
    name: "Group H",
    teams: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"],
    fixtures: [
      { home: "Spain", away: "Cape Verde", date: "2026-06-15", time: "TBD", venue: "MetLife Stadium, New York" },
      { home: "Saudi Arabia", away: "Uruguay", date: "2026-06-15", time: "TBD", venue: "Empower Field, Denver" },
      { home: "Spain", away: "Saudi Arabia", date: "2026-06-19", time: "TBD", venue: "MetLife Stadium, New York" },
      { home: "Cape Verde", away: "Uruguay", date: "2026-06-19", time: "TBD", venue: "Empower Field, Denver" },
      { home: "Spain", away: "Uruguay", date: "2026-06-23", time: "TBD", venue: "MetLife Stadium, New York" },
      { home: "Cape Verde", away: "Saudi Arabia", date: "2026-06-23", time: "TBD", venue: "Empower Field, Denver" }
    ]
  },
  I: {
    name: "Group I",
    teams: ["France", "Senegal", "Iraq", "Norway"],
    fixtures: [
      { home: "France", away: "Senegal", date: "2026-06-16", time: "TBD", venue: "MetLife Stadium, New York" },
      { home: "Iraq", away: "Norway", date: "2026-06-16", time: "TBD", venue: "Levi's Stadium, San Francisco" },
      { home: "France", away: "Iraq", date: "2026-06-20", time: "TBD", venue: "MetLife Stadium, New York" },
      { home: "Senegal", away: "Norway", date: "2026-06-20", time: "TBD", venue: "Levi's Stadium, San Francisco" },
      { home: "France", away: "Norway", date: "2026-06-24", time: "TBD", venue: "MetLife Stadium, New York" },
      { home: "Senegal", away: "Iraq", date: "2026-06-24", time: "TBD", venue: "Levi's Stadium, San Francisco" }
    ]
  },
  J: {
    name: "Group J",
    teams: ["Argentina", "Algeria", "Austria", "Jordan"],
    fixtures: [
      { home: "Argentina", away: "Algeria", date: "2026-06-16", time: "TBD", venue: "AT&T Stadium, Dallas" },
      { home: "Austria", away: "Jordan", date: "2026-06-16", time: "TBD", venue: "Estadio Universitario, Monterrey" },
      { home: "Argentina", away: "Austria", date: "2026-06-20", time: "TBD", venue: "Rose Bowl, Pasadena" },
      { home: "Algeria", away: "Jordan", date: "2026-06-20", time: "TBD", venue: "AT&T Stadium, Dallas" },
      { home: "Argentina", away: "Jordan", date: "2026-06-24", time: "TBD", venue: "Rose Bowl, Pasadena" },
      { home: "Algeria", away: "Austria", date: "2026-06-24", time: "TBD", venue: "AT&T Stadium, Dallas" }
    ]
  },
  K: {
    name: "Group K",
    teams: ["Portugal", "DR Congo", "Uzbekistan", "Colombia"],
    fixtures: [
      { home: "Portugal", away: "DR Congo", date: "2026-06-17", time: "TBD", venue: "Levi's Stadium, San Francisco" },
      { home: "Uzbekistan", away: "Colombia", date: "2026-06-17", time: "TBD", venue: "Lincoln Financial Field, Philadelphia" },
      { home: "Portugal", away: "Uzbekistan", date: "2026-06-21", time: "TBD", venue: "Levi's Stadium, San Francisco" },
      { home: "DR Congo", away: "Colombia", date: "2026-06-21", time: "TBD", venue: "Hard Rock Stadium, Miami" },
      { home: "Portugal", away: "Colombia", date: "2026-06-25", time: "TBD", venue: "Levi's Stadium, San Francisco" },
      { home: "DR Congo", away: "Uzbekistan", date: "2026-06-25", time: "TBD", venue: "Hard Rock Stadium, Miami" }
    ]
  },
  L: {
    name: "Group L",
    teams: ["England", "Croatia", "Ghana", "Panama"],
    fixtures: [
      { home: "England", away: "Croatia", date: "2026-06-17", time: "TBD", venue: "MetLife Stadium, New York" },
      { home: "Ghana", away: "Panama", date: "2026-06-17", time: "TBD", venue: "Gillette Stadium, Boston" },
      { home: "England", away: "Ghana", date: "2026-06-21", time: "TBD", venue: "MetLife Stadium, New York" },
      { home: "Croatia", away: "Panama", date: "2026-06-21", time: "TBD", venue: "Gillette Stadium, Boston" },
      { home: "England", away: "Panama", date: "2026-06-25", time: "TBD", venue: "MetLife Stadium, New York" },
      { home: "Croatia", away: "Ghana", date: "2026-06-25", time: "TBD", venue: "Gillette Stadium, Boston" }
    ]
  }
};

const VENUES = [
  { name: "MetLife Stadium", city: "East Rutherford, NJ", country: "USA", capacity: 82500, matches: 8, isFinalVenue: true, flag: "🇺🇸" },
  { name: "AT&T Stadium", city: "Arlington, TX", country: "USA", capacity: 80000, matches: 9, flag: "🇺🇸" },
  { name: "SoFi Stadium", city: "Inglewood, CA", country: "USA", capacity: 70240, matches: 8, flag: "🇺🇸" },
  { name: "Rose Bowl", city: "Pasadena, CA", country: "USA", capacity: 88565, matches: 7, flag: "🇺🇸" },
  { name: "Levi's Stadium", city: "Santa Clara, CA", country: "USA", capacity: 68500, matches: 8, flag: "🇺🇸" },
  { name: "Lincoln Financial Field", city: "Philadelphia, PA", country: "USA", capacity: 67594, matches: 7, flag: "🇺🇸" },
  { name: "Gillette Stadium", city: "Foxborough, MA", country: "USA", capacity: 65878, matches: 7, flag: "🇺🇸" },
  { name: "Bank of America Stadium", city: "Charlotte, NC", country: "USA", capacity: 74867, matches: 7, flag: "🇺🇸" },
  { name: "Hard Rock Stadium", city: "Miami, FL", country: "USA", capacity: 64767, matches: 8, flag: "🇺🇸" },
  { name: "Lumen Field", city: "Seattle, WA", country: "USA", capacity: 68740, matches: 7, flag: "🇺🇸" },
  { name: "Empower Field", city: "Denver, CO", country: "USA", capacity: 76125, matches: 7, flag: "🇺🇸" },
  { name: "BMO Field", city: "Toronto, ON", country: "Canada", capacity: 45736, matches: 7, flag: "🇨🇦" },
  { name: "BC Place", city: "Vancouver, BC", country: "Canada", capacity: 54500, matches: 7, flag: "🇨🇦" },
  { name: "Estadio Azteca", city: "Mexico City", country: "Mexico", capacity: 87523, matches: 5, isOpeningVenue: true, flag: "🇲🇽" },
  { name: "Estadio Akron", city: "Zapopan", country: "Mexico", capacity: 49850, matches: 5, flag: "🇲🇽" },
  { name: "Estadio BBVA", city: "Monterrey", country: "Mexico", capacity: 53500, matches: 5, flag: "🇲🇽" },
  { name: "Estadio Universitario", city: "Monterrey", country: "Mexico", capacity: 42000, matches: 5, flag: "🇲🇽" },
  { name: "Arrowhead Stadium", city: "Kansas City, MO", country: "USA", capacity: 76416, matches: 6, flag: "🇺🇸" }
];

const TEAMS = [
  { name: "Mexico", flag: "🇲🇽", group: "A", confederation: "CONCACAF", fifaRank: 15, isHost: true, debut: false, previousBest: "Quarterfinals (1970, 1986)" },
  { name: "South Africa", flag: "🇿🇦", group: "A", confederation: "CAF", fifaRank: 68, isHost: false, debut: false, previousBest: "Group Stage (2010, as host)" },
  { name: "South Korea", flag: "🇰🇷", group: "A", confederation: "AFC", fifaRank: 23, isHost: false, debut: false, previousBest: "4th Place (2002)" },
  { name: "Czechia", flag: "🇨🇿", group: "A", confederation: "UEFA", fifaRank: 37, isHost: false, debut: false, previousBest: "Runner-Up (1934, 1962 as Czechoslovakia)" },
  { name: "Canada", flag: "🇨🇦", group: "B", confederation: "CONCACAF", fifaRank: 42, isHost: true, debut: false, previousBest: "Group Stage (2022)" },
  { name: "Bosnia and Herzegovina", flag: "🇧🇦", group: "B", confederation: "UEFA", fifaRank: 62, isHost: false, debut: false, previousBest: "Group Stage (2014)" },
  { name: "Qatar", flag: "🇶🇦", group: "B", confederation: "AFC", fifaRank: 58, isHost: false, debut: false, previousBest: "Group Stage (2022)" },
  { name: "Switzerland", flag: "🇨🇭", group: "B", confederation: "UEFA", fifaRank: 19, isHost: false, debut: false, previousBest: "Quarterfinals (1934, 1938, 1954)" },
  { name: "Brazil", flag: "🇧🇷", group: "C", confederation: "CONMEBOL", fifaRank: 5, isHost: false, debut: false, previousBest: "Champions (1958, 1962, 1970, 1994, 2002)" },
  { name: "Morocco", flag: "🇲🇦", group: "C", confederation: "CAF", fifaRank: 14, isHost: false, debut: false, previousBest: "4th Place (2022)" },
  { name: "Haiti", flag: "🇭🇹", group: "C", confederation: "CONCACAF", fifaRank: 74, isHost: false, debut: false, previousBest: "Group Stage (1974)" },
  { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", group: "C", confederation: "UEFA", fifaRank: 40, isHost: false, debut: false, previousBest: "Group Stage (1974, 1978, 1982, 1986, 1990, 1998)" },
  { name: "United States", flag: "🇺🇸", group: "D", confederation: "CONCACAF", fifaRank: 11, isHost: true, debut: false, previousBest: "3rd Place (1930)" },
  { name: "Paraguay", flag: "🇵🇾", group: "D", confederation: "CONMEBOL", fifaRank: 62, isHost: false, debut: false, previousBest: "Quarterfinals (1962)" },
  { name: "Australia", flag: "🇦🇺", group: "D", confederation: "AFC", fifaRank: 25, isHost: false, debut: false, previousBest: "Round of 16 (2006, 2022)" },
  { name: "Türkiye", flag: "🇹🇷", group: "D", confederation: "UEFA", fifaRank: 29, isHost: false, debut: false, previousBest: "3rd Place (2002)" },
  { name: "Germany", flag: "🇩🇪", group: "E", confederation: "UEFA", fifaRank: 9, isHost: false, debut: false, previousBest: "Champions (1954, 1974, 1990, 2014)" },
  { name: "Curaçao", flag: "🇨🇼", group: "E", confederation: "CONCACAF", fifaRank: 82, isHost: false, debut: true, previousBest: "Debut" },
  { name: "Ivory Coast", flag: "🇨🇮", group: "E", confederation: "CAF", fifaRank: 47, isHost: false, debut: false, previousBest: "Group Stage (2006, 2010, 2014)" },
  { name: "Ecuador", flag: "🇪🇨", group: "E", confederation: "CONMEBOL", fifaRank: 48, isHost: false, debut: false, previousBest: "Round of 16 (2006)" },
  { name: "Netherlands", flag: "🇳🇱", group: "F", confederation: "UEFA", fifaRank: 7, isHost: false, debut: false, previousBest: "Runner-Up (1974, 1978, 2010)" },
  { name: "Japan", flag: "🇯🇵", group: "F", confederation: "AFC", fifaRank: 18, isHost: false, debut: false, previousBest: "Round of 16 (2002, 2010, 2022)" },
  { name: "Sweden", flag: "🇸🇪", group: "F", confederation: "UEFA", fifaRank: 28, isHost: false, debut: false, previousBest: "3rd Place (1950, 1994)" },
  { name: "Tunisia", flag: "🇹🇳", group: "F", confederation: "CAF", fifaRank: 30, isHost: false, debut: false, previousBest: "Group Stage" },
  { name: "Belgium", flag: "🇧🇪", group: "G", confederation: "UEFA", fifaRank: 8, isHost: false, debut: false, previousBest: "3rd Place (1986, 2018)" },
  { name: "Egypt", flag: "🇪🇬", group: "G", confederation: "CAF", fifaRank: 34, isHost: false, debut: false, previousBest: "Round of 16 (1934)" },
  { name: "Iran", flag: "🇮🇷", group: "G", confederation: "AFC", fifaRank: 22, isHost: false, debut: false, previousBest: "Group Stage" },
  { name: "New Zealand", flag: "🇳🇿", group: "G", confederation: "OFC", fifaRank: 97, isHost: false, debut: false, previousBest: "Group Stage (1982, 2010)" },
  { name: "Spain", flag: "🇪🇸", group: "H", confederation: "UEFA", fifaRank: 1, isHost: false, debut: false, previousBest: "Champions (2010)" },
  { name: "Cape Verde", flag: "🇨🇻", group: "H", confederation: "CAF", fifaRank: 86, isHost: false, debut: true, previousBest: "Debut" },
  { name: "Saudi Arabia", flag: "🇸🇦", group: "H", confederation: "AFC", fifaRank: 55, isHost: false, debut: false, previousBest: "Round of 16 (1994)" },
  { name: "Uruguay", flag: "🇺🇾", group: "H", confederation: "CONMEBOL", fifaRank: 16, isHost: false, debut: false, previousBest: "Champions (1930, 1950)" },
  { name: "France", flag: "🇫🇷", group: "I", confederation: "UEFA", fifaRank: 3, isHost: false, debut: false, previousBest: "Champions (1998, 2018)" },
  { name: "Senegal", flag: "🇸🇳", group: "I", confederation: "CAF", fifaRank: 20, isHost: false, debut: false, previousBest: "Quarterfinals (2002)" },
  { name: "Iraq", flag: "🇮🇶", group: "I", confederation: "AFC", fifaRank: 55, isHost: false, debut: false, previousBest: "Group Stage (1986)" },
  { name: "Norway", flag: "🇳🇴", group: "I", confederation: "UEFA", fifaRank: 26, isHost: false, debut: false, previousBest: "Round of 16 (1998)" },
  { name: "Argentina", flag: "🇦🇷", group: "J", confederation: "CONMEBOL", fifaRank: 2, isHost: false, debut: false, previousBest: "Champions (1978, 1986, 2022)" },
  { name: "Algeria", flag: "🇩🇿", group: "J", confederation: "CAF", fifaRank: 38, isHost: false, debut: false, previousBest: "Round of 16 (2014)" },
  { name: "Austria", flag: "🇦🇹", group: "J", confederation: "UEFA", fifaRank: 27, isHost: false, debut: false, previousBest: "3rd Place (1954)" },
  { name: "Jordan", flag: "🇯🇴", group: "J", confederation: "AFC", fifaRank: 70, isHost: false, debut: true, previousBest: "Debut" },
  { name: "Portugal", flag: "🇵🇹", group: "K", confederation: "UEFA", fifaRank: 6, isHost: false, debut: false, previousBest: "3rd Place (1966, 2006)" },
  { name: "DR Congo", flag: "🇨🇩", group: "K", confederation: "CAF", fifaRank: 56, isHost: false, debut: false, previousBest: "Quarterfinals (1974 as Zaïre)" },
  { name: "Uzbekistan", flag: "🇺🇿", group: "K", confederation: "AFC", fifaRank: 69, isHost: false, debut: true, previousBest: "Debut" },
  { name: "Colombia", flag: "🇨🇴", group: "K", confederation: "CONMEBOL", fifaRank: 13, isHost: false, debut: false, previousBest: "Quarterfinals (2014)" },
  { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "L", confederation: "UEFA", fifaRank: 4, isHost: false, debut: false, previousBest: "Champions (1966)" },
  { name: "Croatia", flag: "🇭🇷", group: "L", confederation: "UEFA", fifaRank: 10, isHost: false, debut: false, previousBest: "Runner-Up (2018)" },
  { name: "Ghana", flag: "🇬🇭", group: "L", confederation: "CAF", fifaRank: 53, isHost: false, debut: false, previousBest: "Quarterfinals (2010)" },
  { name: "Panama", flag: "🇵🇦", group: "L", confederation: "CONCACAF", fifaRank: 49, isHost: false, debut: false, previousBest: "Group Stage (2018)" }
];

const TOURNAMENT_DATES = {
  opening_match: "2026-06-11",
  group_stage_end: "2026-06-27",
  round_of_32_start: "2026-06-28",
  round_of_32_end: "2026-07-03",
  round_of_16_start: "2026-07-04",
  round_of_16_end: "2026-07-07",
  quarterfinals: ["2026-07-10", "2026-07-11"],
  semifinals: ["2026-07-14", "2026-07-15"],
  third_place: "2026-07-18",
  final: "2026-07-19"
};

const getTeam = (name) => TEAMS.find(t => t.name === name);
const getTeamFlag = (name) => { const t = getTeam(name); return t ? t.flag : ''; };
const getConfederationColor = (conf) => {
  const colors = {
    UEFA: '#4361EE',
    CONMEBOL: '#E63946',
    AFC: '#FFD700',
    CAF: '#2ECC71',
    CONCACAF: '#E67E22',
    OFC: '#9B59B6'
  };
  return colors[conf] || '#9CA3AF';
};

const PLAYERS = [
  { name: "Lionel Messi", team: "Argentina", pos: "FW", age: 38, caps: 180, goals: 106, rank: 1, img: "🇦🇷", style: "Magic · Vision · GOAT" },
  { name: "Kylian Mbappé", team: "France", pos: "FW", age: 27, caps: 75, goals: 44, rank: 2, img: "🇫🇷", style: "Speed · Finishing · Clutch" },
  { name: "Rodri", team: "Spain", pos: "MF", age: 29, caps: 55, goals: 4, rank: 3, img: "🇪🇸", style: "Control · Passing · Engine" },
  { name: "Jude Bellingham", team: "England", pos: "MF", age: 22, caps: 35, goals: 6, rank: 4, img: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", style: "Power · Dribble · Composure" },
  { name: "Vinícius Jr.", team: "Brazil", pos: "FW", age: 25, caps: 35, goals: 16, rank: 5, img: "🇧🇷", style: "Dribble · Flair · Big Game" },
  { name: "Florian Wirtz", team: "Germany", pos: "MF", age: 23, caps: 25, goals: 5, rank: 6, img: "🇩🇪", style: "Creativity · Technique · Vision" },
  { name: "Lamine Yamal", team: "Spain", pos: "FW", age: 18, caps: 18, goals: 4, rank: 7, img: "🇪🇸", style: "Wonderkid · Flair · Fearless" },
  { name: "Erling Haaland", team: "Norway", pos: "FW", age: 25, caps: 36, goals: 36, rank: 8, img: "🇳🇴", style: "Power · Speed · Goal Machine" },
  { name: "Cody Gakpo", team: "Netherlands", pos: "FW", age: 26, caps: 35, goals: 14, rank: 9, img: "🇳🇱", style: "Versatile · Pace · Ice Cold" },
  { name: "James Rodríguez", team: "Colombia", pos: "MF", age: 34, caps: 105, goals: 28, rank: 10, img: "🇨🇴", style: "Elegance · Passing · Golden Boot 2014" },
  { name: "Khvicha Kvaratskhelia", team: "Georgia", pos: "FW", age: 24, caps: 30, goals: 15, rank: 11, img: "🇬🇪", style: "Dribble · Creativity · Flair" },
  { name: "Yann Sommer", team: "Switzerland", pos: "GK", age: 37, caps: 95, goals: 0, rank: 12, img: "🇨🇭", style: "Reflexes · Leader · Wall" },
  { name: "Rodrigo De Paul", team: "Argentina", pos: "MF", age: 31, caps: 70, goals: 3, rank: 13, img: "🇦🇷", style: "Energy · Passing · Engine" },
  { name: "Alphonso Davies", team: "Canada", pos: "DF", age: 25, caps: 50, goals: 14, rank: 14, img: "🇨🇦", style: "Speed · Overlap · Roadrunner" },
  { name: "Rafael Leão", team: "Portugal", pos: "FW", age: 26, caps: 35, goals: 6, rank: 15, img: "🇵🇹", style: "Explosive · Skill · Power" },
  { name: "Luis Díaz", team: "Colombia", pos: "FW", age: 28, caps: 55, goals: 15, rank: 16, img: "🇨🇴", style: "Dribble · Pace · Passion" }
];

const TRIVIA = [
  { q: "Which country has won the most World Cups?", a: "Brazil (5 titles: 1958, 1962, 1970, 1994, 2002)", hint: "🇧🇷 Samba football" },
  { q: "Who scored the most goals in a single World Cup tournament?", a: "Just Fontaine (13 goals in 1958)", hint: "🇫🇷 French legend" },
  { q: "Which stadium will host the 2026 Final?", a: "MetLife Stadium, East Rutherford, New Jersey", hint: "🏟️ Near NYC" },
  { q: "How many teams will compete in the 2026 World Cup?", a: "48 teams — the first 48-team edition in history", hint: "Double the 1998–2022 format" },
  { q: "Which player has the most World Cup appearances?", a: "Lionel Messi (26 matches across 5 tournaments)", hint: "🇦🇷 The GOAT" },
  { q: "Which country is the defending champion going into 2026?", a: "Argentina (won in 2022 vs France)", hint: "🇦🇷 Messi's crowning moment" },
  { q: "What is the only country to play in every World Cup?", a: "Brazil (participated in all 22 editions)", hint: "🇧🇷 Always there" },
  { q: "Who scored the fastest goal in World Cup history?", a: "Hakan Şükür (11 seconds in 2002)", hint: "🇹🇷 Turkish delight" },
  { q: "Which 2026 debutant nation has the lowest FIFA ranking?", a: "Curaçao (ranked 82nd)", hint: "🌴 Caribbean island" },
  { q: "How many stadiums will host 2026 matches?", a: "16 stadiums across 3 countries", hint: "🇺🇸🇨🇦🇲🇽" }
];

const TEAM_THEMES = [
  { id: 'argentina', name: 'Argentina', color: '#75AADB', flag: '🇦🇷' },
  { id: 'brazil', name: 'Brazil', color: '#009739', flag: '🇧🇷' },
  { id: 'france', name: 'France', color: '#002395', flag: '🇫🇷' },
  { id: 'germany', name: 'Germany', color: '#DD0000', flag: '🇩🇪' },
  { id: 'england', name: 'England', color: '#CF081F', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'spain', name: 'Spain', color: '#C60B1E', flag: '🇪🇸' },
  { id: 'netherlands', name: 'Netherlands', color: '#FF6600', flag: '🇳🇱' },
  { id: 'portugal', name: 'Portugal', color: '#006600', flag: '🇵🇹' },
  { id: 'mexico', name: 'Mexico', color: '#006847', flag: '🇲🇽' },
  { id: 'usa', name: 'USA', color: '#002664', flag: '🇺🇸' },
  { id: 'uruguay', name: 'Uruguay', color: '#003DA5', flag: '🇺🇾' },
  { id: 'belgium', name: 'Belgium', color: '#DA291C', flag: '🇧🇪' },
  { id: 'croatia', name: 'Croatia', color: '#C8102E', flag: '🇭🇷' },
  { id: 'japan', name: 'Japan', color: '#BC002D', flag: '🇯🇵' },
  { id: 'italy', name: 'Italy', color: '#009246', flag: '🇮🇹' },
  { id: 'morocco', name: 'Morocco', color: '#C1272D', flag: '🇲🇦' }
];

const COUNTRY_CODES = {
  "Mexico": "mx", "South Africa": "za", "South Korea": "kr", "Czechia": "cz",
  "Canada": "ca", "Bosnia and Herzegovina": "ba", "Qatar": "qa", "Switzerland": "ch",
  "Brazil": "br", "Morocco": "ma", "Haiti": "ht",   "Scotland": "gb",
  "United States": "us", "Paraguay": "py", "Australia": "au", "Türkiye": "tr",
  "Germany": "de", "Curaçao": "cw", "Ivory Coast": "ci", "Ecuador": "ec",
  "Netherlands": "nl", "Japan": "jp", "Sweden": "se", "Tunisia": "tn",
  "Belgium": "be", "Egypt": "eg", "Iran": "ir", "New Zealand": "nz",
  "Spain": "es", "Cape Verde": "cv", "Saudi Arabia": "sa", "Uruguay": "uy",
  "France": "fr", "Senegal": "sn", "Iraq": "iq", "Norway": "no",
  "Argentina": "ar", "Algeria": "dz", "Austria": "at", "Jordan": "jo",
  "Portugal": "pt", "DR Congo": "cd", "Uzbekistan": "uz", "Colombia": "co",
  "England": "gb", "Croatia": "hr", "Ghana": "gh", "Panama": "pa"
};
