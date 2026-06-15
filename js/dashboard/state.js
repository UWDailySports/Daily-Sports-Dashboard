const state = {

    school: null,

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

async function fetchUserSchoolInfo() {
    const userSchoolResponse = await fetch("/.netlify/functions/get-user-school", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ }) 
    }); 

    const userSchooldata = await userSchoolResponse.json();
    const school= userSchooldata.userSchoolInfo.rows[0];

    state.school = school.school;

    document.documentElement.style.setProperty(
        "--primary_color",
        state.school.color_1
    ); 

    document.documentElement.style.setProperty(
        "--secondary_color",
        state.school.color_2
    );
}
