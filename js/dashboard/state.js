const state = {

    currWriter: null,
    currGameId: null,
    currTab: null,

    filters: {
        active: { sports: [], locations: [] },
        myGames: { sports: [], locations: [] },
        availableGames: { sports: [], locations: [] },
        historyGames: { sports: [], locations: [], months: [] },
        allGames: { sports: [], locations: [], months: [] }
    }
};

const userSchoolResponse = await fetch("/.netlify/functions/get-user-school", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ }) 
}); 

const data = await userSchoolResponse.json();
const school_info = data.userSchoolInfo.rows[0];

const school = school_info.school;

document.documentElement.style.setProperty(
    "--primary_color",
    school_info.color_1
); 

document.documentElement.style.setProperty(
    "--secondary_color",
    school_info.color_2
);

console.log(school);
console.log(school_info.color_1);
console.log(school_info.color_2);
