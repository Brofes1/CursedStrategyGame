class Faction
{
    constructor(name)
    {
        this.name = name;
        this.color = factionColors[numberOfFactions++];
    }
}