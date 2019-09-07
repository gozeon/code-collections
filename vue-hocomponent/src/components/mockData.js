const staff = [
    {
        name: "Michael Scott",
        id: 0,
        awards: 2
    },
    {
        name: "Toby Flenderson",
        id: 1,
        awards: 0
    },
    {
        name: "Dwight K. Schrute",
        id: 2,
        awards: 10
    },
    {
        name: "Jim Halpert",
        id: 3,
        awards: 1
    },
    {
        name: "Andy Bernard",
        id: 4,
        awards: 0
    },
    {
        name: "Phyllis Vance",
        id: 5,
        awards: 0
    },
    {
        name: "Stanley Hudson",
        id: 6,
        awards: 0
    }
];
const paperCompanies = [
    {
        id: 0,
        name: "Staples",
        net: 10000000
    },
    {
        id: 1,
        name: "Dundler Mufflin",
        net: 5000000
    },
    {
        id: 2,
        name: "Michael Scott Paper Company",
        net: 300000
    },
    {
        id: 3,
        name: "Prince Family Paper",
        net: 30000
    }
];

export default {
    getStaff() {
        return staff;
    },
    getCompanies() {
        return paperCompanies;
    },
    increaseAward(id) {
        staff[id].awards++;
    },
    decreaseAward(id) {
        staff[id].awards--;
    },
    setNetWorth(id) {
        paperCompanies[id].net = Math.random() * (5000000 - 50000) + 50000;
    }
};