/** Takes in a movement direction in internal form and expands it to the full direction. */
const directionConversion = {
    "N": "North",
    "O": "Northeast",
    "E": "East",
    "M": "Southeast",
    "S": "South",
    "D": "Southwest",
    "W": "West",
    "L": "Northwest",
    "I": "Invalid",
    "C": "Unit"
};

/** Takes in a movement direction in internal form and converts it to be displayed on the scale. */
const shortDirectionConversion = {
    "N": "N",
    "O": "",
    "E": "E",
    "M": "",
    "S": "S",
    "D": "",
    "W": "W",
    "L": ""
};

/** Converts movement direction to a color for rendering. */
const directionToColor = {
    "North":      "#FF0000",
    "Northeast":  "#FF6E00",
    "East":       "#FFA000",
    "Southeast":  "#FFE100",
    "South":      "#64FF00",
    "Southwest":  "#00FF96",
    "West":       "#00B4FF",
    "Northwest":  "#3F3FFF"
};

/** Converts attack power to a color for rendering. */
const attackToColor = {
    1: "#FF0000",
    2: "#FF6E00",
    3: "#FFA000",
    4: "#FFE100",
    5: "#C8FF00",
    6: "#64FF00",
    7: "#00FF96",
    8: "#00FFFF",
    9: "#00B4FF"
};

/** How much health a unit starts with. */
const startingHealthValues = {
    "Archer":  8,
    "Knight":  25,
    "City":    75,
    "Ship":    12,
    "Captain": 150
};

/** The amount of times a unit can move. */
const moveAmounts = {
    "Archer":  1,
    "Knight":  1,
    "City":    1,
    "Ship":    3,
    "Captain": 1
};

/** The amount of times a unit can attack. */
const attackAmounts = {
    "Archer":  1,
    "Knight":  1,
    "City":    1,
    "Ship":    3,
    "Captain": 2
};

// Compressed Directions:
// N: N, NE: O, E: E, SE: M, S: S, SW: D, W: W, NW: L, NONE: I, UNIT: C
/** Compressed movement data for unit types. */
const movementPatterns = {
    "Archer": {
        "N": "IIIIIIIIIIIIIIIIIIIILLNOOIIIILLNOOIIIIWWCEEIIIIDDSMMIIIIDDSMMIIIIIIIIIIIIIIIIIIII",
        "O": "IIIIIIIIIIIIIIIIIIIILLNOOIIIILLNOOIIIIWWCEEIIIIDDSMMIIIIDDSMMIIIIIIIIIIIIIIIIIIII",
        "E": "IIIIIIIIIIIIIIIIIIIILLNOOIIIILLNOOIIIIWWCEEIIIIDDSMMIIIIDDSMMIIIIIIIIIIIIIIIIIIII",
        "M": "IIIIIIIIIIIIIIIIIIIILLNOOIIIILLNOOIIIIWWCEEIIIIDDSMMIIIIDDSMMIIIIIIIIIIIIIIIIIIII",
        "S": "IIIIIIIIIIIIIIIIIIIILLNOOIIIILLNOOIIIIWWCEEIIIIDDSMMIIIIDDSMMIIIIIIIIIIIIIIIIIIII",
        "D": "IIIIIIIIIIIIIIIIIIIILLNOOIIIILLNOOIIIIWWCEEIIIIDDSMMIIIIDDSMMIIIIIIIIIIIIIIIIIIII",
        "W": "IIIIIIIIIIIIIIIIIIIILLNOOIIIILLNOOIIIIWWCEEIIIIDDSMMIIIIDDSMMIIIIIIIIIIIIIIIIIIII",
        "L": "IIIIIIIIIIIIIIIIIIIILLNOOIIIILLNOOIIIIWWCEEIIIIDDSMMIIIIDDSMMIIIIIIIIIIIIIIIIIIII"
    },
    "Knight": {
        "N": "IIIIIIIIIIIIIIIIIIIIININIIIIIWIIIEIIIIIICIIIIIIWIIIEIIIIISISIIIIIIIIIIIIIIIIIIIII",
        "O": "IIIIIIIIIIIIIIIIIIIIININIIIIIWIIIEIIIIIICIIIIIIWIIIEIIIIISISIIIIIIIIIIIIIIIIIIIII",
        "E": "IIIIIIIIIIIIIIIIIIIIININIIIIIWIIIEIIIIIICIIIIIIWIIIEIIIIISISIIIIIIIIIIIIIIIIIIIII",
        "M": "IIIIIIIIIIIIIIIIIIIIININIIIIIWIIIEIIIIIICIIIIIIWIIIEIIIIISISIIIIIIIIIIIIIIIIIIIII",
        "S": "IIIIIIIIIIIIIIIIIIIIININIIIIIWIIIEIIIIIICIIIIIIWIIIEIIIIISISIIIIIIIIIIIIIIIIIIIII",
        "D": "IIIIIIIIIIIIIIIIIIIIININIIIIIWIIIEIIIIIICIIIIIIWIIIEIIIIISISIIIIIIIIIIIIIIIIIIIII",
        "W": "IIIIIIIIIIIIIIIIIIIIININIIIIIWIIIEIIIIIICIIIIIIWIIIEIIIIISISIIIIIIIIIIIIIIIIIIIII",
        "L": "IIIIIIIIIIIIIIIIIIIIININIIIIIWIIIEIIIIIICIIIIIIWIIIEIIIIISISIIIIIIIIIIIIIIIIIIIII"
    },
    "City": {
        "N": "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIILIOIIIIIIICIIIIIIIDIMIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
        "O": "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIINIIIIIIIWCEIIIIIIISIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
        "E": "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIILIOIIIIIIICIIIIIIIDIMIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
        "M": "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIINIIIIIIIWCEIIIIIIISIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
        "S": "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIILIOIIIIIIICIIIIIIIDIMIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
        "D": "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIINIIIIIIIWCEIIIIIIISIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
        "W": "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIILIOIIIIIIICIIIIIIIDIMIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
        "L": "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIINIIIIIIIWCEIIIIIIISIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII"
    },
    "Ship": {
        "N": "IIIIIIIIIIIIIIIIIIIIILNOIIIIIILNOIIIIIIICIIIIIIIONLIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
        "O": "IIIIIIIIIIIIIIIIIIIIIIINOIIIIIINOEIIIIIECEIIIIIIONIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
        "E": "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIMIOOIIIIIECEEIIIIIOIMMIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
        "M": "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIMSIIIIIIIECEIIIIIIISMEIIIIIIISMIIIIIIIIIIIIIIIIIIII",
        "S": "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIMSDIIIIIIICIIIIIIIDSMIIIIIIDSMIIIIIIIIIIIIIIIIIIIII",
        "D": "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIISDIIIIIIWCWIIIIIWDSIIIIIIDSIIIIIIIIIIIIIIIIIIIIIII",
        "W": "IIIIIIIIIIIIIIIIIIIIIIIIIIIIILLIDIIIIIWWCWIIIIIDDILIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
        "L": "IIIIIIIIIIIIIIIIIIIILNIIIIIIIWLNIIIIIIIWCWIIIIIIINLIIIIIIIIIIIIIIIIIIIIIIIIIIIIII"
    },
    "Captain": {
        "N": "LLLNNNOOOLLLNNNOOOLLLLNOOOOWWLLNOOEEWWWWCEEEEWWDDSMMEEDDDDSMMMMDDDSSSMMMDDDSSSMMM",
        "O": "LLLNNNOOOLLLNNNOOOLLLLNOOOOWWLLNOOEEWWWWCEEEEWWDDSMMEEDDDDSMMMMDDDSSSMMMDDDSSSMMM",
        "E": "LLLNNNOOOLLLNNNOOOLLLLNOOOOWWLLNOOEEWWWWCEEEEWWDDSMMEEDDDDSMMMMDDDSSSMMMDDDSSSMMM",
        "M": "LLLNNNOOOLLLNNNOOOLLLLNOOOOWWLLNOOEEWWWWCEEEEWWDDSMMEEDDDDSMMMMDDDSSSMMMDDDSSSMMM",
        "S": "LLLNNNOOOLLLNNNOOOLLLLNOOOOWWLLNOOEEWWWWCEEEEWWDDSMMEEDDDDSMMMMDDDSSSMMMDDDSSSMMM",
        "D": "LLLNNNOOOLLLNNNOOOLLLLNOOOOWWLLNOOEEWWWWCEEEEWWDDSMMEEDDDDSMMMMDDDSSSMMMDDDSSSMMM",
        "W": "LLLNNNOOOLLLNNNOOOLLLLNOOOOWWLLNOOEEWWWWCEEEEWWDDSMMEEDDDDSMMMMDDDSSSMMMDDDSSSMMM",
        "L": "LLLNNNOOOLLLNNNOOOLLLLNOOOOWWLLNOOEEWWWWCEEEEWWDDSMMEEDDDDSMMMMDDDSSSMMMDDDSSSMMM"
    }
}

/** A list on whether a unit type goes on land or water. */
const movementStyle = {
    "Archer":  "Ground",
    "Knight":  "Ground",
    "City":    "Ground",
    "Ship":    "Water",
    "Captain": "Ground"
};

/** Compressed attack data for unit types. */
const attackPatterns = {
    "Archer": {
        "N": "000000000000000000000000000000000000000000000000222000003444300033333330000000000",
        "O": "000000000000000000000000000000000000033200000034220000034430000033330000000000000",
        "E": "000000000030000000033000000034200000034200000034200000033000000030000000000000000",
        "M": "000000000033330000034430000034220000033200000000000000000000000000000000000000000",
        "S": "000000000033333330003444300000222000000000000000000000000000000000000000000000000",
        "D": "000000000000033330000034430000022430000002330000000000000000000000000000000000000",
        "W": "000000000000000030000000330000002430000002430000002430000000330000000030000000000",
        "L": "000000000000000000000000000000000000000002330000022430000034430000033330000000000"
    },
    "Knight": {
        "N": "000000000000000000000909000009000900000000000009000900000909000000000000000000000",
        "O": "000000000000000000000909000009000900000000000009000900000909000000000000000000000",
        "E": "000000000000000000000909000009000900000000000009000900000909000000000000000000000",
        "M": "000000000000000000000909000009000900000000000009000900000909000000000000000000000",
        "S": "000000000000000000000909000009000900000000000009000900000909000000000000000000000",
        "D": "000000000000000000000909000009000900000000000009000900000909000000000000000000000",
        "W": "000000000000000000000909000009000900000000000009000900000909000000000000000000000",
        "L": "000000000000000000000909000009000900000000000009000900000909000000000000000000000"
    },
    "City": {
        "N": "000000000000000000000000000000080000000808000000080000000000000000000000000000000",
        "O": "000000000000000000000000000000808000000000000000808000000000000000000000000000000",
        "E": "000000000000000000000000000000080000000808000000080000000000000000000000000000000",
        "M": "000000000000000000000000000000808000000000000000808000000000000000000000000000000",
        "S": "000000000000000000000000000000080000000808000000080000000000000000000000000000000",
        "D": "000000000000000000000000000000808000000000000000808000000000000000000000000000000",
        "W": "000000000000000000000000000000080000000808000000080000000000000000000000000000000",
        "L": "000000000000000000000000000000808000000000000000808000000000000000000000000000000"
    },
    "Ship": {
        "N": "000000000000010000000020000020000020030404030020000020000010000000000000000000000",
        "O": "000000000000200010003000200020400000000000000000004020001000300000002000000000000",
        "E": "000000000000232000000000000000040000001000210000040000000000000000232000000000000",
        "M": "000000000000002000001000300000004020000000000020400000003000200000200010000000000",
        "S": "000000000000000000000010000020000020030404030020000020000020000000010000000000000",
        "D": "000000000000200000003000100020400000000000000000004020002000300010002000000000000",
        "W": "000000000000232000000000000000000000012000100000000000000000000000232000000000000",
        "L": "000000000010002000002000300000000020000000000020000000003000100000200000000000000"
    },
    "Captain": {
        "N": "111111111122222221123333321013555310012505210012555210012222210011111110000000000",
        "O": "001111111011222221012333321012555321012505321012555321012222211011111110000000000",
        "E": "000000111011111221012223321012555321012505321012555321012223321011111221000000111",
        "M": "000000000011111110012222211012555321012505321012555321012333321011222221001111111",
        "S": "000000000011111110012222210012555210012505210013555310123333321122222221111111111",
        "D": "000000000011111110112222210123555210123505210123555210123333210122222110111111100",
        "W": "111000000122111110123322210123555210123505210123555210123322210122111110111000000",
        "L": "111111100122222110123333210123555210123505210123555210112222210011111110000000000"
    }
};

/** Compressed terrain data. Is uncompressed in code with {@link Grid.CreateTerrain()} using {@link terrainNumberToFull}. */
const terrainData = "1111111122111111111111111111111111111112221111111111111111111111111111122211111111111111111111111111112221111111111111111111111111111222211111111122211111111111112222221111111112222211111111112222222111111111122222111111111122222111111111111222221111111111222111111111111111222111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111221111111111111111111111111111222211111111111111111111111111222222111111111111111111111111122222221111111111111111111112332222211111111111111111111112223322222111221111222111222211222233221111112223332222222222222222332111111122233322222222222222221111111111122333222222222222222111111111111113332111111112222221111111111111111111111111112222111111111111111111111111111122221111111111111111111111111111122211111111111111111111111111111333111111111111111111111111111113331111111111111111111111111111122211111111111111111111111111111122211111111111111111111111111111222111111111111111111111111111112222111111111111111111111111111112221111111111";

/** Takes in compressed terrain data and uncompresses it. */
const terrainNumberToFull = {
    "1": "land",
    "2": "water",
    "3": "bridge"
};

/** The list of all the different colors. Matches to a letter in {@link viewModeColors}.*/
const colorTypes = ["land", "water", "bridge", "terrainText", "spawningText", "attackText", "movementText"];

/** Takes in a view mode and outputs a list of whether a color is enabled or disabled in the form of a string.
 *  See: {@link Grid.UpdateViewModeColors()}
 */
const viewModeColors = {
    "Terrain":  "EEEEDDDE",
    "Spawning": "DDDDEDDE",
    "Attack":   "DDDDDEDE",
    "Movement": "DDDDDDEE"
};

/** Takes in a color type and outputs the corresponding enabled color (The view modes toggle colors to an "enabled" and "disabled" state) */
const enabledColors = {
    "land":         "#00CC00",
    "water":        "#0000CC",
    "bridge":       "#964B00",
    "terrainText":  "#00FF00",
    "spawningText": "#FF00FF",
    "attackText":   "#FF0000",
    "movementText": "#FF6600",
    "selectedCell": "#FF00FF"
};

/** Takes in a color type and outputs the corresponding disabled color (The view modes toggle colors to an "enabled" and "disabled" state) */
const disabledColors = {
    "land":         "#999999",
    "water":        "#BBBBBB",
    "bridge":       "#666666",
    "terrainText":  "#777777",
    "spawningText": "#777777",
    "attackText":   "#777777",
    "movementText": "#777777",
    "selectedCell": "#FF00FF"
};

// When updating view modes, make sure to update colorTypes, viewModeTextToColorType and viewModeColors (types AND strings) too!
// Don't forget to add the colors for the enabled/disabled buttons!
/** The list of all the different view mode buttons. */
const viewModes = ["Terrain", "Spawning", "Attack", "Movement"];

/** Takes in a view mode name and converts it to an internal name. */
const viewModeTextToColorType = {
    "Terrain": "terrainText",
    "Spawning": "spawningText", 
    "Attack": "attackText", 
    "Movement": "movementText"
};

/** Takes in a unit type and outputs the character they are to be displayed as. */
const unitDisplayNames = {
    "Archer":  "a",
    "Knight":  "k",
    "City":    "C",
    "Captain": "c",
    "Ship":    "s"
};

/** The list of faction colors. */
const factionColors = ["#000000", "#FF5555", "#FFCC00", "#FFFFFF"];

/** A list of all the unit info to display for {@link Grid.DisplaySelectedUnitInfo()}. */
const unitInfoToDisplay = ["factionName", "type", "direction", "health", "moves", "attacks"];

const internalUnitInfoToDisplayString = {
    "factionName": "Faction",
    "type":        "Type",
    "direction":   "Direction",
    "health":      "Health",
    "moves":       "Moves",
    "attacks":     "Attacks"
};